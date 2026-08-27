"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import {
  CUT_ANCHORS,
  CUT_ANCHOR_IDS,
  GAME_BLOCK_SIZE,
  GAME_WORLD_HEIGHT,
  GAME_WORLD_WIDTH,
  MAX_GAME_BLOCKS,
  PUZZLE_TARGET_COUNT,
  applyBlockCut,
  createPuzzleTarget,
  createSquareBlock,
  getScoreBand,
  moveCuttingBlock,
  pointsToSvg,
  previewBlockCut,
  rotateCuttingBlock,
  scoreSimilarity,
  type CutAnchorId,
  type CutSide,
  type CuttingBlock,
  type PuzzleTarget,
  type ScoreBand,
} from "@/lib/rpg/cuttingGame";
import styles from "./CuttingPlayground.module.css";

const RESULT_MAGE_IMAGES = {
  excellent: {
    src: "/images/rpg/results/mage-excellent.webp",
    width: 585,
    height: 1200,
  },
  details: {
    src: "/images/rpg/results/mage-details.webp",
    width: 558,
    height: 1200,
  },
  effort: {
    src: "/images/rpg/results/mage-effort.webp",
    width: 554,
    height: 1200,
  },
  ignored: {
    src: "/images/rpg/results/mage-ignored.webp",
    width: 578,
    height: 1200,
  },
  hopeless: {
    src: "/images/rpg/results/mage-hopeless.webp",
    width: 590,
    height: 1200,
  },
} satisfies Record<ScoreBand, { src: string; width: number; height: number }>;

type StatusKey =
  | "ready"
  | "added"
  | "selected"
  | "cutApplied"
  | "cutInvalid"
  | "removed"
  | "limit"
  | "scored"
  | "newRound"
  | "poolRestarted";

type PlaygroundSession = {
  target: PuzzleTarget;
  blocks: CuttingBlock[];
  nextBlock: number;
  seenTargetIds: number[];
};

let playgroundSession: PlaygroundSession | null = null;

function createSession(): PlaygroundSession {
  const target = createPuzzleTarget();
  return {
    target,
    blocks: [],
    nextBlock: 1,
    seenTargetIds: [target.id],
  };
}

function percentage(value: number, total: number): string {
  return `${(value / total) * 100}%`;
}

function blockStyle(block: CuttingBlock, selected: boolean): CSSProperties {
  return {
    left: percentage(block.x, GAME_WORLD_WIDTH),
    top: percentage(block.y, GAME_WORLD_HEIGHT),
    width: percentage(GAME_BLOCK_SIZE, GAME_WORLD_WIDTH),
    height: percentage(GAME_BLOCK_SIZE, GAME_WORLD_HEIGHT),
    transform: `rotate(${block.rotation}deg)`,
    zIndex: selected ? 900 : Math.round(block.y + GAME_BLOCK_SIZE),
  };
}

export function CuttingPlayground({ homeHref }: { homeHref: string }) {
  const t = useTranslations("playground");
  const sceneRef = useRef<HTMLDivElement>(null);
  const cutButtonRef = useRef<HTMLButtonElement>(null);
  const newRoundButtonRef = useRef<HTMLButtonElement>(null);
  const resultPrimaryRef = useRef<HTMLButtonElement>(null);
  const dragging = useRef<{
    id: string;
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [initialSession] = useState<PlaygroundSession>(() =>
    playgroundSession ?? createSession(),
  );

  const [target, setTarget] = useState(initialSession.target);
  const [blocks, setBlocks] = useState(initialSession.blocks);
  const [nextBlock, setNextBlock] = useState(initialSession.nextBlock);
  const [seenTargetIds, setSeenTargetIds] = useState(
    initialSession.seenTargetIds,
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusKey>("ready");
  const [score, setScore] = useState<number | null>(null);
  const [cutting, setCutting] = useState(false);
  const [cutStart, setCutStart] = useState<CutAnchorId>("top");
  const [cutEnd, setCutEnd] = useState<CutAnchorId>("bottomRight");
  const [cutSide, setCutSide] = useState<CutSide>("left");
  const [nextCutPoint, setNextCutPoint] = useState<"start" | "end">("start");

  const selectedBlock =
    blocks.find((block) => block.id === selectedBlockId) ?? null;
  const cutPreview = useMemo(
    () =>
      selectedBlock
        ? previewBlockCut(selectedBlock, cutStart, cutEnd, cutSide)
        : null,
    [cutEnd, cutSide, cutStart, selectedBlock],
  );

  useEffect(() => {
    playgroundSession = { target, blocks, nextBlock, seenTargetIds };
  }, [blocks, nextBlock, seenTargetIds, target]);

  useEffect(() => {
    if (score === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() =>
      resultPrimaryRef.current?.focus(),
    );
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
    };
  }, [score]);

  const toWorldPoint = useCallback((clientX: number, clientY: number) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((clientX - rect.left) / rect.width) * GAME_WORLD_WIDTH,
      y: ((clientY - rect.top) / rect.height) * GAME_WORLD_HEIGHT,
    };
  }, []);

  const updateBlock = useCallback(
    (id: string, update: (block: CuttingBlock) => CuttingBlock) => {
      setBlocks((current) =>
        current.map((block) => (block.id === id ? update(block) : block)),
      );
      setScore(null);
    },
    [],
  );

  const addBlock = () => {
    if (blocks.length >= MAX_GAME_BLOCKS) {
      setStatus("limit");
      return;
    }
    const block = createSquareBlock(
      `piece-${Date.now().toString(36)}-${nextBlock}`,
      nextBlock,
    );
    setBlocks((current) => [...current, block]);
    setNextBlock((current) => current + 1);
    setSelectedBlockId(block.id);
    setScore(null);
    setStatus("added");
  };

  const removeSelected = () => {
    if (!selectedBlockId) return;
    setBlocks((current) =>
      current.filter((block) => block.id !== selectedBlockId),
    );
    setSelectedBlockId(null);
    setScore(null);
    setStatus("removed");
  };

  const rotateSelected = (direction: -1 | 1) => {
    if (!selectedBlockId) return;
    updateBlock(selectedBlockId, (block) =>
      rotateCuttingBlock(block, direction),
    );
  };

  const openCutter = () => {
    if (!selectedBlock) return;
    setCutStart("top");
    setCutEnd("bottomRight");
    setCutSide("left");
    setNextCutPoint("start");
    setCutting(true);
  };

  const closeCutter = () => {
    setCutting(false);
    requestAnimationFrame(() => cutButtonRef.current?.focus());
  };

  const chooseCutAnchor = (anchor: CutAnchorId) => {
    if (nextCutPoint === "start") {
      if (anchor === cutEnd) return;
      setCutStart(anchor);
      setNextCutPoint("end");
      return;
    }
    if (anchor === cutStart) return;
    setCutEnd(anchor);
    setNextCutPoint("start");
  };

  const confirmCut = () => {
    if (!selectedBlock || !cutPreview) {
      setStatus("cutInvalid");
      return;
    }
    const cutBlock = applyBlockCut(selectedBlock, cutStart, cutEnd, cutSide);
    if (!cutBlock) {
      setStatus("cutInvalid");
      return;
    }
    setBlocks((current) =>
      current.map((block) =>
        block.id === selectedBlock.id ? cutBlock : block,
      ),
    );
    setScore(null);
    setStatus("cutApplied");
    closeCutter();
  };

  const newRound = () => {
    const poolRestarted = seenTargetIds.length >= PUZZLE_TARGET_COUNT;
    const excludedIds = poolRestarted ? [target.id] : seenTargetIds;
    const nextTarget = createPuzzleTarget(Math.random, excludedIds);
    setTarget(nextTarget);
    setSeenTargetIds(
      poolRestarted ? [nextTarget.id] : [...seenTargetIds, nextTarget.id],
    );
    setBlocks([]);
    setNextBlock(1);
    setSelectedBlockId(null);
    setScore(null);
    setCutting(false);
    setStatus(poolRestarted ? "poolRestarted" : "newRound");
  };

  const finishRound = () => {
    setScore(scoreSimilarity(blocks, target));
    setStatus("scored");
  };

  const restartFromResult = () => {
    newRound();
    requestAnimationFrame(() => newRoundButtonRef.current?.focus());
  };

  const handlePointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    block: CuttingBlock,
  ) => {
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
    setScore(null);
    setStatus("selected");
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragging.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const point = toWorldPoint(event.clientX, event.clientY);
    updateBlock(drag.id, (block) =>
      moveCuttingBlock(block, point.x - drag.offsetX, point.y - drag.offsetY),
    );
  };

  const handlePointerEnd = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragging.current?.pointerId !== event.pointerId) return;
    dragging.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleBlockKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    block: CuttingBlock,
  ) => {
    const step = event.shiftKey ? 1 : 5;
    const movement: Record<string, { x: number; y: number }> = {
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
    };
    const delta = movement[event.key];
    if (delta) {
      event.preventDefault();
      setSelectedBlockId(block.id);
      updateBlock(block.id, (current) =>
        moveCuttingBlock(current, current.x + delta.x, current.y + delta.y),
      );
      return;
    }
    if (event.key === "q" || event.key === "Q") {
      event.preventDefault();
      rotateSelectedBlock(block.id, -1);
    } else if (event.key === "e" || event.key === "E") {
      event.preventDefault();
      rotateSelectedBlock(block.id, 1);
    } else if (event.key === "c" || event.key === "C") {
      event.preventDefault();
      setSelectedBlockId(block.id);
      setCutStart("top");
      setCutEnd("bottomRight");
      setCutSide("left");
      setNextCutPoint("start");
      setCutting(true);
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      setBlocks((current) =>
        current.filter((currentBlock) => currentBlock.id !== block.id),
      );
      setSelectedBlockId(null);
      setScore(null);
      setStatus("removed");
    } else if (event.key === "Escape") {
      setSelectedBlockId(null);
    }
  };

  const rotateSelectedBlock = (id: string, direction: -1 | 1) => {
    setSelectedBlockId(id);
    updateBlock(id, (block) => rotateCuttingBlock(block, direction));
  };

  const scoreBand = score === null ? null : getScoreBand(score);
  const resultMageImage = scoreBand ? RESULT_MAGE_IMAGES[scoreBand] : null;

  const handleCutDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeCutter();
      return;
    }
    if (event.key !== "Tab") return;

    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        "button:not(:disabled)",
      ),
    );
    const first = buttons[0];
    const last = buttons.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleResultDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const actions = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]"),
    );
    const first = actions[0];
    const last = actions.at(-1);
    if (!first || !last) return;
    event.preventDefault();
    const currentIndex = actions.findIndex(
      (action) => action === document.activeElement,
    );
    const nextIndex = event.shiftKey
      ? currentIndex <= 0
        ? actions.length - 1
        : currentIndex - 1
      : currentIndex < 0 || currentIndex === actions.length - 1
        ? 0
        : currentIndex + 1;
    actions[nextIndex]?.focus();
  };

  return (
    <section className={`rpg-panel ${styles.workshop}`}>
      <header className={styles.topbar}>
        <div>
          <span className={styles.roundLabel}>{t("roundTarget")}</span>
          <strong>
            {t("shapeNumber", {
              number: target.id.toString().padStart(3, "0"),
            })}
          </strong>
        </div>
        <button
          ref={newRoundButtonRef}
          type="button"
          className={styles.newRound}
          onClick={newRound}
        >
          {t("newRound")}
        </button>
      </header>

      <div className={styles.layout}>
        <div className={styles.sceneColumn}>
          <div
            ref={sceneRef}
            className={styles.scene}
            role="group"
            aria-label={t("sceneLabel")}
          >
            <div className={styles.targetLabel}>
              <span aria-hidden="true">◇</span>
              {t("targetLabel")}
            </div>
            <svg
              className={styles.targetShape}
              viewBox={`0 0 ${GAME_WORLD_WIDTH} ${GAME_WORLD_HEIGHT}`}
              aria-hidden="true"
            >
              <g>
                {target.polygons.map((polygon, index) => (
                  <polygon key={index} points={pointsToSvg(polygon)} />
                ))}
              </g>
            </svg>

            <div className={styles.stagingLabel}>{t("stagingLabel")}</div>

            {blocks.map((block, index) => {
              const selected = block.id === selectedBlockId;
              return (
                <button
                  key={block.id}
                  type="button"
                  className={`${styles.block} ${selected ? styles.selectedBlock : ""}`}
                  style={blockStyle(block, selected)}
                  data-block-id={block.id}
                  aria-label={t("blockLabel", { index: index + 1 })}
                  aria-pressed={selected}
                  onPointerDown={(event) => handlePointerDown(event, block)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerEnd}
                  onPointerCancel={handlePointerEnd}
                  onKeyDown={(event) => handleBlockKeyDown(event, block)}
                  onClick={() => {
                    setSelectedBlockId(block.id);
                    setStatus("selected");
                  }}
                >
                  <svg viewBox="0 0 100 100" aria-hidden="true">
                    <polygon points={pointsToSvg(block.polygon)} />
                  </svg>
                </button>
              );
            })}
          </div>

          <p
            className={styles.status}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span aria-hidden="true">◆</span>
            {t(`status.${status}`)}
          </p>
        </div>

        <aside className={styles.controls} aria-label={t("controlsLabel")}>
          <section className={styles.sourceSection}>
            <div>
              <span className={styles.controlKicker}>{t("sourceKicker")}</span>
              <h2>{t("sourceTitle")}</h2>
              <p>{t("sourceHint")}</p>
            </div>
            <button
              type="button"
              className={styles.sourceBlock}
              onClick={addBlock}
              disabled={blocks.length >= MAX_GAME_BLOCKS}
              aria-label={t("addBlock")}
            >
              <span aria-hidden="true" />
              <strong>{t("addBlock")}</strong>
              <small>
                {blocks.length}/{MAX_GAME_BLOCKS}
              </small>
            </button>
          </section>

          <section className={styles.selectedSection}>
            <span className={styles.controlKicker}>{t("selectedKicker")}</span>
            <h2>{selectedBlock ? t("selectedTitle") : t("nothingSelected")}</h2>
            <div className={styles.blockActions}>
              <button
                type="button"
                disabled={!selectedBlock}
                onClick={() => rotateSelected(-1)}
                aria-label={t("rotateLeft")}
              >
                ↶
              </button>
              <button
                type="button"
                disabled={!selectedBlock}
                onClick={() => rotateSelected(1)}
                aria-label={t("rotateRight")}
              >
                ↷
              </button>
              <button
                ref={cutButtonRef}
                type="button"
                className={styles.cutAction}
                disabled={!selectedBlock}
                onClick={openCutter}
              >
                <span aria-hidden="true">✂</span>
                {t("cutBlock")}
              </button>
              <button
                type="button"
                disabled={!selectedBlock}
                onClick={removeSelected}
              >
                {t("removeBlock")}
              </button>
            </div>
          </section>

          <button
            type="button"
            className={styles.doneButton}
            onClick={finishRound}
          >
            <span>{t("done")}</span>
            <strong>{t("compare")}</strong>
          </button>

          <p className={styles.keyboardHelp}>{t("keyboardHelp")}</p>
        </aside>
      </div>

      {cutting && selectedBlock && (
        <div className={styles.cutOverlay} onKeyDown={handleCutDialogKeyDown}>
          <div
            className={styles.cutDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cut-dialog-title"
            aria-describedby="cut-dialog-description"
          >
            <header>
              <span className={styles.controlKicker}>{t("cutPower")}</span>
              <h2 id="cut-dialog-title">{t("cutTitle")}</h2>
              <p id="cut-dialog-description">{t("cutDescription")}</p>
            </header>

            <div className={styles.cutWorkbench}>
              <div className={styles.cutCanvas}>
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <polygon
                    className={styles.cutOriginal}
                    points={pointsToSvg(selectedBlock.polygon)}
                  />
                  {cutPreview && (
                    <polygon
                      className={styles.cutKept}
                      points={pointsToSvg(cutPreview)}
                    />
                  )}
                  <line
                    className={styles.cutLine}
                    x1={CUT_ANCHORS[cutStart].x}
                    y1={CUT_ANCHORS[cutStart].y}
                    x2={CUT_ANCHORS[cutEnd].x}
                    y2={CUT_ANCHORS[cutEnd].y}
                  />
                </svg>
                {CUT_ANCHOR_IDS.map((anchorId) => {
                  const anchor = CUT_ANCHORS[anchorId];
                  const marker =
                    anchorId === cutStart
                      ? "1"
                      : anchorId === cutEnd
                        ? "2"
                        : "";
                  return (
                    <button
                      key={anchorId}
                      type="button"
                      className={styles.cutAnchor}
                      data-selected={Boolean(marker)}
                      style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
                      onClick={() => chooseCutAnchor(anchorId)}
                      aria-label={t(`anchors.${anchorId}`)}
                      autoFocus={anchorId === cutStart}
                    >
                      {marker || "·"}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className={styles.cutStep}>
              {t("nextCutPoint", { point: nextCutPoint === "start" ? 1 : 2 })}
            </p>
            {!cutPreview && (
              <p className={styles.cutWarning}>{t("cutInvalid")}</p>
            )}

            <div className={styles.cutControls}>
              <button
                type="button"
                onClick={() =>
                  setCutSide((current) =>
                    current === "left" ? "right" : "left",
                  )
                }
              >
                {t("flipCutSide")}
              </button>
              <button
                type="button"
                className={styles.confirmCut}
                disabled={!cutPreview}
                onClick={confirmCut}
              >
                {t("confirmCut")}
              </button>
              <button type="button" onClick={closeCutter}>
                {t("cancelCut")}
              </button>
            </div>
          </div>
        </div>
      )}

      {score !== null &&
        scoreBand &&
        resultMageImage &&
        createPortal(
          <div
            className={styles.resultOverlay}
            onKeyDown={handleResultDialogKeyDown}
          >
            <div
              className={styles.resultDialog}
              data-band={scoreBand}
              role="dialog"
              aria-modal="true"
              aria-labelledby="result-dialog-title"
              aria-describedby="result-dialog-message"
            >
              <div className={styles.resultMage} aria-hidden="true">
                <Image
                  src={resultMageImage.src}
                  alt=""
                  width={resultMageImage.width}
                  height={resultMageImage.height}
                  unoptimized
                />
              </div>

              <div className={styles.resultContent}>
                <span className={styles.resultKicker}>
                  {t("resultVerdict")}
                </span>
                <div className={styles.resultScore}>
                  <span>{t("resultLabel")}</span>
                  <strong>{score}%</strong>
                </div>
                <h2 id="result-dialog-title">
                  {t(`resultTitles.${scoreBand}`)}
                </h2>
                <p id="result-dialog-message">{t(`results.${scoreBand}`)}</p>
                <p className={styles.resultMageDescription}>
                  {t(`resultMageAlt.${scoreBand}`)}
                </p>

                <div className={styles.resultActions}>
                  <button
                    ref={resultPrimaryRef}
                    type="button"
                    className={styles.playAgain}
                    onClick={restartFromResult}
                  >
                    {t("playAgain")}
                  </button>
                  <a href={homeHref} className={styles.leaveGame}>
                    {t("leaveGame")}
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
