import test from "node:test"
import assert from "node:assert/strict"
import { SessionBinding } from "../src/session-binding.js"

test("requires explicit session before any audio is eligible", () => {
  const b = new SessionBinding()
  assert.equal(b.current(), null)
  assert.equal(b.consume({directory:"/work",sessionID:"s1",messageID:"m",partID:"p",revision:"r"}), false)
})

test("only matching workspace and session are eligible", () => {
  const b = new SessionBinding()
  b.select({directory:"/work",sessionID:"s1"})
  assert.equal(b.matches({directory:"/work",sessionID:"s1"}), true)
  assert.equal(b.matches({directory:"/other",sessionID:"s1"}), false)
  assert.equal(b.matches({directory:"/work",sessionID:"s2"}), false)
})

test("deduplicates revisions in selected session and resets on switching", () => {
  const b = new SessionBinding()
  b.select({directory:"/work",sessionID:"s1"})
  const part = {directory:"/work",sessionID:"s1",messageID:"m1",partID:"p1",revision:"r1"}
  assert.equal(b.consume(part), true)
  assert.equal(b.consume(part), false)
  assert.equal(b.consume({...part,revision:"r2"}), true)
  b.select({directory:"/work",sessionID:"s2"})
  assert.equal(b.consume(part), false)
  assert.equal(b.consume({...part,sessionID:"s2"}), true)
  b.clear()
  assert.equal(b.consume({...part,sessionID:"s2"}), false)
})

test("rejects blank or oversized targets", () => {
  const b = new SessionBinding()
  assert.throws(() => b.select({directory:" ",sessionID:"s"}), TypeError)
  assert.throws(() => b.select({directory:"/work",sessionID:" ".repeat(300)}), TypeError)
  assert.equal(b.current(), null)
})

test("returns copies of current binding, avoiding caller mutation", () => {
  const b = new SessionBinding()
  const current = b.select({directory:"/work",sessionID:"s"})
  current.directory = "/other"
  assert.deepEqual(b.current(), {directory:"/work",sessionID:"s"})
})
