import React, { useRef, useState } from 'react';
import { resize } from 'utils';

export type PuzzleEdge = 'flat' | 'tab' | 'blank';
export type PuzzlePiece = {
   id: number;
   dataUrl: string;
   edge: PuzzleEdgeMap;
};

export type PuzzleEdgeMap = {
   top: PuzzleEdge;
   right: PuzzleEdge;
   bottom: PuzzleEdge;
   left: PuzzleEdge;
};

export type PieceSize = {
   totalSize: number;
   pieceSize: number;
   tabSize: number;
};

export type OnImageUpdate = (
   puzzlePieces: PuzzlePiece[],
   pieceSize: PieceSize,
) => void;

interface Props {
   onImageUpdate: OnImageUpdate;
}
const PIECE_COUNT = 16;
const PIECE_SIZE = 500;

const PuzzleGenerator = ({ onImageUpdate }: Props) => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   // const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
   const [pieceCount, setPieceCount] = useState(PIECE_COUNT);

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const img = new Image();
      const blob = URL.createObjectURL(file);
      img.src = URL.createObjectURL(file);

      img.onload = () => splitImage(img);

      resize(blob, { maxSize: PIECE_SIZE }).onload((resized) => {
         const img = new Image();
         img.src =
            resized instanceof Blob ? URL.createObjectURL(resized) : resized;

         img.onload = () => splitImage(img);
      });
   };

   const splitImage = (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cols = Math.ceil(Math.sqrt(pieceCount));
      const rows = Math.ceil(pieceCount / cols);

      const pieceSize = Math.floor(
         Math.min(img.width / cols, img.height / rows),
      );

      const tabSize = pieceSize * 0.33;
      const curve = pieceSize * 0.33;

      const usableWidth = pieceSize * cols;
      const usableHeight = pieceSize * rows;
      // (박스 - 사용영역) / 2 = 중앙 정렬
      const offsetX = Math.floor((img.width - usableWidth) / 2);
      const offsetY = Math.floor((img.height - usableHeight) / 2);

      const pieceMap: PuzzleEdgeMap[][] = [];
      for (let row = 0; row < rows; row++) {
         pieceMap[row] = [];
         for (let col = 0; col < cols; col++) {
            const top =
               row === 0 ? 'flat' : invert(pieceMap[row - 1][col].bottom);
            const left =
               col === 0 ? 'flat' : invert(pieceMap[row][col - 1].right);
            const right = col === cols - 1 ? 'flat' : randomEdge();
            const bottom = row === rows - 1 ? 'flat' : randomEdge();
            pieceMap[row][col] = { top, right, bottom, left };
         }
      }

      const newPieces: PuzzlePiece[] = [];
      for (let row = 0; row < rows; row++) {
         for (let col = 0; col < cols; col++) {
            if (newPieces.length >= pieceCount) break;

            const totalSize = pieceSize + tabSize * 2;
            canvas.width = totalSize;
            canvas.height = totalSize;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(tabSize, tabSize);
            ctx.beginPath();
            drawPuzzlePath(ctx, pieceSize, pieceMap[row][col], tabSize, curve);
            ctx.clip();

            ctx.drawImage(
               img,
               offsetX + col * pieceSize - tabSize, // 원본 이미지에서 자를 X좌표 시작점
               offsetY + row * pieceSize - tabSize, // 원본 이미지에서 자를 Y좌표 시작점
               pieceSize + tabSize * 2, // 원본 이미지에서 자를 X좌표 끝점 (넓이)
               pieceSize + tabSize * 2, // 원본 이미지에서 자를 Y좌표 끝점 (높이)
               -tabSize, // X좌표 시작점
               -tabSize, // Y좌표 시작점
               pieceSize + tabSize * 2, // X좌표 끝점 (넓이)
               pieceSize + tabSize * 2, // Y좌표 끝점 (높이)
            );
            ctx.restore();

            const dataUrl = canvas.toDataURL();
            newPieces.push({
               id: row * cols + col,
               dataUrl,
               edge: pieceMap[row][col],
            });
         }
      }

      // setPieces(shuffleArray(newPieces));
      onImageUpdate(shuffleArray(newPieces), {
         totalSize: pieceSize + tabSize * 2,
         pieceSize,
         tabSize,
      });
   };

   const drawPuzzlePath = (
      ctx: CanvasRenderingContext2D,
      size: number,
      edges: PuzzleEdgeMap,
      tabSize: number,
      curve: number,
   ) => {
      ctx.moveTo(0, 0);
      drawEdge(ctx, size, edges.top, 'top', tabSize, curve);
      drawEdge(ctx, size, edges.right, 'right', tabSize, curve);
      drawEdge(ctx, size, edges.bottom, 'bottom', tabSize, curve);
      drawEdge(ctx, size, edges.left, 'left', tabSize, curve);
      ctx.closePath();
   };

   const drawEdge = (
      ctx: CanvasRenderingContext2D,
      size: number,
      type: PuzzleEdge,
      direction: 'top' | 'right' | 'bottom' | 'left',
      tabSize: number,
      curve: number,
   ) => {
      const center = size / 2;
      const tabDir = type === 'tab' ? -1 : 1;

      if (type === 'flat') {
         switch (direction) {
            case 'top':
               ctx.lineTo(size, 0);
               break;
            case 'right':
               ctx.lineTo(size, size);
               break;
            case 'bottom':
               ctx.lineTo(0, size);
               break;
            case 'left':
               ctx.lineTo(0, 0);
               break;
         }
         return;
      }

      if (direction === 'top') {
         ctx.lineTo(center - tabSize / 2, 0);
         ctx.bezierCurveTo(
            center - curve,
            tabDir * tabSize,
            center + curve,
            tabDir * tabSize,
            center + tabSize / 2,
            0,
         );
         ctx.lineTo(size, 0);
      }

      if (direction === 'right') {
         ctx.lineTo(size, center - tabSize / 2);
         ctx.bezierCurveTo(
            size - tabDir * tabSize,
            center - curve,
            size - tabDir * tabSize,
            center + curve,
            size,
            center + tabSize / 2,
         );
         ctx.lineTo(size, size);
      }

      if (direction === 'bottom') {
         ctx.lineTo(center + tabSize / 2, size);
         ctx.bezierCurveTo(
            center + curve,
            size - tabDir * tabSize,
            center - curve,
            size - tabDir * tabSize,
            center - tabSize / 2,
            size,
         );
         ctx.lineTo(0, size);
      }

      if (direction === 'left') {
         ctx.lineTo(0, center + tabSize / 2);
         ctx.bezierCurveTo(
            tabDir * tabSize,
            center + curve,
            tabDir * tabSize,
            center - curve,
            0,
            center - tabSize / 2,
         );
         ctx.lineTo(0, 0);
      }
   };

   const randomEdge = (): PuzzleEdge => (Math.random() > 0.5 ? 'blank' : 'tab');

   const invert = (edge: PuzzleEdge): PuzzleEdge => {
      if (edge === 'blank') return 'tab';
      if (edge === 'tab') return 'blank';
      return 'flat';
   };

   const shuffleArray = <T,>(array: T[]): T[] => {
      const result = [...array];
      const lastIndex = result.length - 1;
      for (let i = lastIndex; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
   };

   return (
      <div style={{ padding: '1rem' }}>
         <input type="file" accept="image/*" onChange={handleImageUpload} />
         <input
            type="number"
            value={pieceCount}
            onChange={({ target }) => setPieceCount(Number(target.value))}
         />

         <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
   );
};

export default PuzzleGenerator;
