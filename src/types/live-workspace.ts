export type WorkspaceTab = "video_only" | "whiteboard" | "3D_review";

export type WhiteboardTool = "pencil" | "line" | "text" | "hand";

export const WHITEBOARD_COLORS = {
  signalRed: "#FF3B30",
  engineeringBlue: "#007AFF",
  matrixGreen: "#34C759",
  carbonBlack: "#1C1C1E",
} as const;

export type WhiteboardColor = (typeof WHITEBOARD_COLORS)[keyof typeof WHITEBOARD_COLORS];

export type CadRenderMode = "wireframe" | "shaded" | "point_cloud";
