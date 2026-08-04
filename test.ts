import { createClient } from "@libsql/client";

async function test() {
  try {
    const db = createClient({
      url: "file:./prisma/dev.db",
    });
    
    const result = await db.execute("SELECT name FROM sqlite_master WHERE type='table';");
    console.log("Tables:", result.rows);
  } catch(e) {
    console.error("Error:", e);
  }
}
test();
