import { Plugin } from "@opencode/plugin"
import { MurmureVoiceRpc } from "./rpc.js"
import { SessionBinding } from "./session-binding.js"

export default Plugin.define({
  id: "opencode-murmure",
  async setup(ctx) {
    const binding = new SessionBinding()
    const registration = await ctx.rpc.register(MurmureVoiceRpc, {
      selectSession: async (input) => {
        // Selection is an explicit RPC action. No inferred active session.
        return binding.select(input as { directory: string; sessionID: string })!
      },
      clearSession: async () => {
        binding.clear()
        return { selected: false }
      },
      getSession: async () => {
        const selected = binding.current()
        return selected ? { selected: true, ...selected } : { selected: false }
      },
    })

    // Do not subscribe to session contents before the STT/TTS permission
    // boundaries and authenticated Murmure local API have been implemented.
    return () => {
      binding.clear()
      registration.dispose()
    }
  },
})
