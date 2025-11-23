// ============================================================
// CENTRALIZED MODEL CONFIGURATION
// ============================================================
// To add a new model:
//   1. Add a new object to the MODELS array below with:
//      - id: The identifier used in the frontend
//      - name: Display name shown to users
//      - apiModel: The actual model name for the Google AI API
//
// To remove a model:
//   1. Simply delete or comment out the model object
//
// The first model in the array becomes the default model.
// ============================================================

export const MODELS = [
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    apiModel: "gemini-2.5-pro",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    apiModel: "gemini-2.5-flash"
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    apiModel: "gemini-2.5-flash-lite"
  },
] as const;

export const DEFAULT_MODEL = MODELS[0].id;

export function getApiModel(modelId: string): string {
  const model = MODELS.find((m) => m.id === modelId);
  return model?.apiModel || MODELS[0].apiModel;
}
