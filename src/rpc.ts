import { Rpc } from "@opencode/plugin/rpc"

export const MurmureVoiceRpc = Rpc.define({
  id: "murmure-voice",
  methods: {
    selectSession: {
      input: {
        type: "object",
        properties: {
          directory: { type: "string", minLength: 1, maxLength: 4096 },
          sessionID: { type: "string", minLength: 1, maxLength: 256 },
        },
        required: ["directory", "sessionID"],
        additionalProperties: false,
      },
      output: {
        type: "object",
        properties: {
          directory: { type: "string" },
          sessionID: { type: "string" },
        },
        required: ["directory", "sessionID"],
        additionalProperties: false,
      },
    },
    clearSession: {
      input: { type: "object", properties: {}, additionalProperties: false },
      output: {
        type: "object",
        properties: { selected: { type: "boolean" } },
        required: ["selected"],
        additionalProperties: false,
      },
    },
    getSession: {
      input: { type: "object", properties: {}, additionalProperties: false },
      output: {
        type: "object",
        properties: {
          selected: { type: "boolean" },
          directory: { type: "string" },
          sessionID: { type: "string" },
        },
        required: ["selected"],
        additionalProperties: false,
      },
    },
  },
  events: {},
} as const)
