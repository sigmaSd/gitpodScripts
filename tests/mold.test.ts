import { installMold } from "../mold.ts";
import { assert } from "jsr:@std/assert@0.224.0";

Deno.test("test mold", async () => {
  const dir = Deno.makeTempDirSync();
  Deno.chdir(dir);

  await new Deno.Command("cargo", {
    args: ["new", "tester"],
    stderr: "inherit",
  }).spawn().status;
  Deno.chdir("tester");

  await installMold();

  await new Deno.Command("cargo", {
    args: ["b", "--target-dir", "target"],
    stderr: "inherit",
  }).spawn().status;

  const readelfP = new Deno.Command("readelf", {
    args: ["-p", ".comment", "target/debug/tester"],
    stderr: "inherit",
  }).outputSync();

  assert(new TextDecoder().decode(readelfP.stdout).includes("mold"));
});
