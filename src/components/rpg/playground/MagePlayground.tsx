"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { useTranslations } from "next-intl";
import {
  BUILD_ZONE,
  blocksInsideBuildZone,
  generateBlocks,
  moveBlock,
  rotateBlock,
} from "@/lib/rpg/blocks";
import {
  WORLD_HEIGHT,
  WORLD_WIDTH,
  createSculptureSnapshot,
  type SculptureSnapshot,
  type WorldBlock,
} from "@/lib/rpg/sculpture";
import {
  loadSculpture,
  removeSculpture,
  saveSculpture,
} from "@/lib/rpg/storage";
import styles from "./MagePlayground.module.css";

type Point = { x: number; y: number };
type Facing = "left" | "right";
type StorageState = "empty" | "ready" | "invalid" | "unavailable";
type StatusKey =
  | "ready"
  | "loaded"
  | "selected"
  | "emptyFreeze"
  | "frozen"
  | "frozenMemory"
  | "existing"
  | "melted"
  | "refreshed"
  | "storageError"
  | "invalidStorage";

type PlaygroundSession = {
  blocks: WorldBlock[];
  mage: Point;
  facing: Facing;
};

let playgroundSession: PlaygroundSession | null = null;
let generation = 0;

function createLooseBlocks(): WorldBlock[] {
  generation += 1;
  return generateBlocks(Math.random, {
    idPrefix: `set-${Date.now().toString(36)}-${generation}`,
  });
}

function percentage(value: number, total: number): string {
  return `${(value / total) * 100}%`;
}

function blockStyle(block: WorldBlock): CSSProperties {
  return {
    left: percentage(block.x, WORLD_WIDTH),
    top: percentage(block.y, WORLD_HEIGHT),
    width: percentage(block.width, WORLD_WIDTH),
    height: percentage(block.height, WORLD_HEIGHT),
    transform: `rotate(${block.rotation}deg)`,
    zIndex: Math.round(block.y + block.height),
  };
}

export function MagePlayground() {
  const t = useTranslations("playground");
  const sceneRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{
    id: string;
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [active, setActive] = useState(false);
  const [blocks, setBlocks] = useState<WorldBlock[]>([]);
  const [frozen, setFrozen] = useState<SculptureSnapshot | null>(null);
  const [mage, setMage] = useState<Point>({ x: 135, y: 530 });
  const [facing, setFacing] = useState<Facing>("right");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [storageState, setStorageState] = useState<StorageState>("empty");
  const [status, setStatus] = useState<StatusKey>("ready");
  const [confirmLava, setConfirmLava] = useState(false);

  useEffect(() => {
    const session = playgroundSession ?? {
      blocks: createLooseBlocks(),
      mage: { x: 135, y: 530 },
      facing: "right" as const,
    };
    playgroundSession = session;
    setBlocks(session.blocks);
    setMage(session.mage);
    setFacing(session.facing);

    const stored = loadSculpture(window.localStorage);
    setStorageState(stored.status === "ready" ? "ready" : stored.status);
    if (stored.status === "ready") {
      setFrozen(stored.snapshot);
      setStatus("loaded");
    } else if (stored.status === "invalid") {
      setStatus("invalidStorage");
    } else {
      setStatus("ready");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    playgroundSession = { blocks, mage, facing };
  }, [blocks, facing, hydrated, mage]);

  const toWorldPoint = useCallback((clientX: number, clientY: number) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((clientX - rect.left) / rect.width) * WORLD_WIDTH,
      y: ((clientY - rect.top) / rect.height) * WORLD_HEIGHT,
    };
  }, []);

  const updateBlock = useCallback(
    (id: string, update: (block: WorldBlock) => WorldBlock) => {
      setBlocks((current) =>
        current.map((block) => (block.id === id ? update(block) : block)),
      );
    },
    [],
  );

  const moveMage = useCallback((x: number, y: number) => {
    setMage((current) => ({
      x: Math.min(950, Math.max(50, current.x + x)),
      y: Math.min(570, Math.max(175, current.y + y)),
    }));
    if (x < 0) setFacing("left");
    if (x > 0) setFacing("right");
  }, []);

  const activate = () => {
    setActive(true);
    requestAnimationFrame(() => sceneRef.current?.focus());
  };

  const deactivate = () => {
    setActive(false);
    dragging.current = null;
    setSelectedBlockId(null);
  };

  const handleSceneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!active) return;
    if (event.key === "Escape") {
      event.preventDefault();
      deactivate();
      return;
    }
    if ((event.target as HTMLElement).dataset.blockId) return;

    const movement: Record<string, Point> = {
      ArrowUp: { x: 0, y: -25 },
      w: { x: 0, y: -25 },
      W: { x: 0, y: -25 },
      ArrowDown: { x: 0, y: 25 },
      s: { x: 0, y: 25 },
      S: { x: 0, y: 25 },
      ArrowLeft: { x: -25, y: 0 },
      a: { x: -25, y: 0 },
      A: { x: -25, y: 0 },
      ArrowRight: { x: 25, y: 0 },
      d: { x: 25, y: 0 },
      D: { x: 25, y: 0 },
    };
    const delta = movement[event.key];
    if (!delta) return;
    event.preventDefault();
    moveMage(delta.x, delta.y);
  };

  const handleBlockKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    block: WorldBlock,
  ) => {
    if (!active) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      deactivate();
      return;
    }

    const step = event.shiftKey ? 2 : 10;
    const movement: Record<string, Point> = {
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
    };
    const delta = movement[event.key];
    if (delta) {
      event.preventDefault();
      event.stopPropagation();
      setSelectedBlockId(block.id);
      updateBlock(block.id, (current) =>
        moveBlock(current, current.x + delta.x, current.y + delta.y),
      );
      return;
    }
    if (event.key === "q" || event.key === "Q") {
      event.preventDefault();
      updateBlock(block.id, (current) => rotateBlock(current, -1));
    } else if (event.key === "e" || event.key === "E") {
      event.preventDefault();
      updateBlock(block.id, (current) => rotateBlock(current, 1));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedBlockId(block.id);
      setStatus("selected");
    }
  };

  const handlePointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    block: WorldBlock,
  ) => {
    if (!active) return;
    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = toWorldPoint(event.clientX, event.clientY);
    dragging.current = {
      id: block.id,
      pointerId: event.pointerId,
      offsetX: point.x - block.x,
      offsetY: point.y - block.y,
    };
    setSelectedBlockId(block.id);
    setStatus("selected");
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragging.current;
    if (!active || !drag || drag.pointerId !== event.pointerId) return;
    const point = toWorldPoint(event.clientX, event.clientY);
    updateBlock(drag.id, (block) =>
      moveBlock(block, point.x - drag.offsetX, point.y - drag.offsetY),
    );
  };

  const handlePointerEnd = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragging.current?.pointerId !== event.pointerId) return;
    dragging.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const rotateSelected = (direction: -1 | 1) => {
    if (!active || !selectedBlockId) return;
    updateBlock(selectedBlockId, (block) => rotateBlock(block, direction));
  };

  const freezeSculpture = () => {
    if (!active) return;
    if (frozen) {
      setStatus("existing");
      return;
    }
    const sculptureBlocks = blocksInsideBuildZone(blocks);
    if (sculptureBlocks.length === 0) {
      setStatus("emptyFreeze");
      return;
    }

    const snapshot = createSculptureSnapshot(sculptureBlocks);
    const result = saveSculpture(window.localStorage, snapshot);
    setFrozen(snapshot);
    setBlocks(createLooseBlocks());
    setSelectedBlockId(null);
    setStorageState(result.ok ? "ready" : "unavailable");
    setStatus(result.ok ? "frozen" : "frozenMemory");
  };

  const requestLava = () => {
    if (!active) return;
    if (frozen || storageState === "invalid") {
      setConfirmLava(true);
      return;
    }
    setBlocks(createLooseBlocks());
    setSelectedBlockId(null);
    setStatus("refreshed");
  };

  const castLava = () => {
    const result = removeSculpture(window.localStorage);
    if (!result.ok) {
      setStatus("storageError");
      setConfirmLava(false);
      return;
    }
    setFrozen(null);
    setStorageState("empty");
    setBlocks(createLooseBlocks());
    setSelectedBlockId(null);
    setConfirmLava(false);
    setStatus("melted");
  };

  const buildZoneStyle: CSSProperties = {
    left: percentage(BUILD_ZONE.x, WORLD_WIDTH),
    top: percentage(BUILD_ZONE.y, WORLD_HEIGHT),
    width: percentage(BUILD_ZONE.width, WORLD_WIDTH),
    height: percentage(BUILD_ZONE.height, WORLD_HEIGHT),
  };
  const mageStyle: CSSProperties = {
    left: percentage(mage.x, WORLD_WIDTH),
    top: percentage(mage.y, WORLD_HEIGHT),
    zIndex: Math.round(mage.y + 130),
  };

  return (
    <div className={`${styles.workshop} rpg-panel`}>
      <div className={styles.topbar}>
        <div className={styles.mode} data-active={active}>
          <span aria-hidden="true" />
          {active ? t("active") : t("inactive")}
        </div>
        <button
          className={styles.entryButton}
          type="button"
          onClick={active ? deactivate : activate}
        >
          {active ? t("exit") : t("start")}
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.sceneColumn}>
          <div
            ref={sceneRef}
            className={styles.scene}
            data-active={active}
            role="group"
            aria-label={t("sceneLabel")}
            aria-describedby="playground-keyboard-help playground-status"
            tabIndex={active ? 0 : -1}
            onKeyDown={handleSceneKeyDown}
          >
            <div className={styles.lightBeam} aria-hidden="true" />
            <div className={styles.buildZone} style={buildZoneStyle}>
              <span>{t("buildZone")}</span>
            </div>
            <div className={styles.supplyLabel}>{t("supplyZone")}</div>

            {frozen?.blocks.map((block, index) => (
              <div
                key={`frozen-${block.id}`}
                className={`${styles.block} ${styles.frozenBlock}`}
                data-shape={block.shape}
                data-material={block.material}
                style={blockStyle(block)}
                role="img"
                aria-label={t("frozenBlockLabel", { index: index + 1 })}
              >
                <span className={styles.blockRune} aria-hidden="true" />
              </div>
            ))}

            {blocks.map((block, index) => (
              <button
                key={block.id}
                className={`${styles.block} ${styles.looseBlock} ${
                  selectedBlockId === block.id ? styles.selectedBlock : ""
                }`}
                data-block-id={block.id}
                data-shape={block.shape}
                data-material={block.material}
                style={blockStyle(block)}
                type="button"
                tabIndex={active ? 0 : -1}
                aria-pressed={selectedBlockId === block.id}
                aria-label={t("blockLabel", { index: index + 1 })}
                onKeyDown={(event) => handleBlockKeyDown(event, block)}
                onPointerDown={(event) => handlePointerDown(event, block)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
              >
                <span className={styles.blockRune} aria-hidden="true" />
              </button>
            ))}

            <div
              className={styles.mage}
              data-facing={facing}
              style={mageStyle}
              role="img"
              aria-label={t("mageLabel")}
            >
              <span className={styles.mageStaff} aria-hidden="true" />
              <span className={styles.mageBody} aria-hidden="true" />
              <span className={styles.magePortrait} aria-hidden="true" />
              <span className={styles.mageGlow} aria-hidden="true" />
            </div>

            {!active && (
              <button
                className={styles.sceneOverlay}
                type="button"
                onClick={activate}
              >
                <span aria-hidden="true">✦</span>
                <strong>{t("start")}</strong>
              </button>
            )}
          </div>

          <p
            className={styles.status}
            id="playground-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span aria-hidden="true">◆</span>
            {t(status)}
          </p>
        </div>

        <aside className={styles.controls} aria-label={t("telekinesis")}>
          <section className={styles.spell} data-spell="telekinesis">
            <span className={styles.spellIcon} aria-hidden="true">
              ✦
            </span>
            <div>
              <h2>{t("telekinesis")}</h2>
              <p>{t("telekinesisHint")}</p>
            </div>
            <div className={styles.rotateButtons}>
              <button
                type="button"
                disabled={!active || !selectedBlockId}
                aria-label={t("rotateLeft")}
                onClick={() => rotateSelected(-1)}
              >
                ↶
              </button>
              <button
                type="button"
                disabled={!active || !selectedBlockId}
                aria-label={t("rotateRight")}
                onClick={() => rotateSelected(1)}
              >
                ↷
              </button>
            </div>
          </section>

          <button
            className={styles.spell}
            data-spell="frost"
            type="button"
            disabled={!active || !hydrated}
            onClick={freezeSculpture}
          >
            <span className={styles.spellIcon} aria-hidden="true">
              ❄
            </span>
            <span>
              <strong>{t("frost")}</strong>
              <small>{t("frostHint")}</small>
            </span>
          </button>

          <button
            className={styles.spell}
            data-spell="lava"
            type="button"
            disabled={!active || !hydrated}
            onClick={requestLava}
          >
            <span className={styles.spellIcon} aria-hidden="true">
              ◇
            </span>
            <span>
              <strong>{t("lava")}</strong>
              <small>{t("lavaHint")}</small>
            </span>
          </button>

          <section className={styles.movement}>
            <h2>{t("moveMage")}</h2>
            <div className={styles.dpad}>
              <button
                type="button"
                disabled={!active}
                aria-label={t("moveUp")}
                onClick={() => moveMage(0, -25)}
              >
                ↑
              </button>
              <button
                type="button"
                disabled={!active}
                aria-label={t("moveLeft")}
                onClick={() => moveMage(-25, 0)}
              >
                ←
              </button>
              <button
                type="button"
                disabled={!active}
                aria-label={t("moveDown")}
                onClick={() => moveMage(0, 25)}
              >
                ↓
              </button>
              <button
                type="button"
                disabled={!active}
                aria-label={t("moveRight")}
                onClick={() => moveMage(25, 0)}
              >
                →
              </button>
            </div>
          </section>

          <p className={styles.help} id="playground-keyboard-help">
            {t("keyboardHelp")}
          </p>
          <p className={styles.localNote}>{t("localOnly")}</p>
        </aside>
      </div>

      {confirmLava && (
        <div
          className={styles.confirmation}
          role="alertdialog"
          aria-modal="false"
        >
          <span className={styles.confirmIcon} aria-hidden="true">
            ◇
          </span>
          <div>
            <h2>{t("confirmTitle")}</h2>
            <p>{t("confirmDescription")}</p>
          </div>
          <div className={styles.confirmActions}>
            <button type="button" onClick={castLava}>
              {t("confirm")}
            </button>
            <button type="button" onClick={() => setConfirmLava(false)}>
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
