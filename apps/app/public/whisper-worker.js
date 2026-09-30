// On-device speech-to-text for Sessio voice memos.
// Runs Whisper in the browser (WebGPU when available, WebAssembly otherwise).
// Audio never leaves the therapist's device.
import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0";

let asr = null;
let loadingFor = null;

async function load(model) {
  if (asr && loadingFor === model) return asr;
  loadingFor = model;
  const hasGPU = typeof navigator !== "undefined" && "gpu" in navigator && (await navigator.gpu.requestAdapter().catch(() => null));
  asr = await pipeline("automatic-speech-recognition", model, {
    device: hasGPU ? "webgpu" : "wasm",
    dtype: hasGPU ? { encoder_model: "fp32", decoder_model_merged: "q4" } : "q8",
    progress_callback: (p) => {
      if (p.status === "progress" && p.total) self.postMessage({ type: "progress", file: p.file, loaded: p.loaded, total: p.total });
      if (p.status === "ready") self.postMessage({ type: "ready" });
    },
  });
  self.postMessage({ type: "ready", device: hasGPU ? "webgpu" : "wasm" });
  return asr;
}

self.onmessage = async (e) => {
  const { audio, language, model = "onnx-community/whisper-base" } = e.data;
  try {
    const p = await load(model);
    self.postMessage({ type: "transcribing" });
    const out = await p(audio, {
      language: language === "uk" ? "ukrainian" : language === "pl" ? "polish" : "english",
      task: "transcribe",
      chunk_length_s: 30,
      stride_length_s: 5,
    });
    self.postMessage({ type: "done", text: (Array.isArray(out) ? out.map((o) => o.text).join(" ") : out.text).trim() });
  } catch (err) {
    self.postMessage({ type: "error", message: String(err && err.message ? err.message : err) });
  }
};
