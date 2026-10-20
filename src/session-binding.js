// @ts-check
/**
 * Explicit session authority for voice input/output.
 * No event or transcript alone may select an OpenCode session.
 */
export class SessionBinding {
  /** @type {{directory: string, sessionID: string} | null} */
  #selected = null
  /** @type {Set<string>} */
  #consumed = new Set()

  /**
   * @param {{directory: string, sessionID: string}} binding
   */
  select(binding) {
    const directory = binding.directory?.trim()
    const sessionID = binding.sessionID?.trim()
    if (!directory || !sessionID || directory.length > 4096 || sessionID.length > 256) {
      throw new TypeError("A valid directory and sessionID must be explicitly selected")
    }
    if (this.#selected?.directory !== directory || this.#selected?.sessionID !== sessionID) {
      this.#consumed.clear()
    }
    this.#selected = { directory, sessionID }
    return this.current()
  }

  clear() {
    this.#selected = null
    this.#consumed.clear()
  }

  current() {
    return this.#selected ? { ...this.#selected } : null
  }

  /**
   * @param {{directory: string, sessionID: string}} candidate
   */
  matches(candidate) {
    return this.#selected !== null &&
      this.#selected.directory === candidate.directory &&
      this.#selected.sessionID === candidate.sessionID
  }

  /**
   * Only event parts belonging to the manually selected session may be
   * queued. Revisions are never forwarded twice. This does NOT decide which
   * content is safe to pronounce; the TTS backend applies independent filters.
   *
   * @param {{directory: string, sessionID: string, messageID: string, partID: string, revision: string}} part
   */
  consume(part) {
    if (!this.matches(part) || !part.messageID || !part.partID || !part.revision) return false
    const key = JSON.stringify([part.messageID, part.partID, part.revision])
    if (this.#consumed.has(key)) return false
    // Bound memory: do not keep a replay history beyond one live window.
    // Fail closed when the live buffer fills. Clearing it would allow old
    // parts to be replayed as new audio. A future durable cursor can replace
    // this bound without silently weakening the deduplication guarantee.
    if (this.#consumed.size >= 2048) return false
    this.#consumed.add(key)
    return true
  }
}
