import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

// insert API keys!
// const OPENAI_API_KEY = ;
// const SUPABASE_URL = ;
// const SUPABASE_ANON_KEY = ;
// const SUPABASE_SERVICE_ROLE_KEY = ;



const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface User {
  id: string;
  name: string;
  tags?: string[];
  facts?: string[];
  likes?: string;
  looking_for?: string;
}

async function generateEmbeddingsForUsers(): Promise<void> {
  console.log("Starting embedding generation...");

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, tags, facts, likes, looking_for');

    if (error) throw error;
    if (!users?.length) return console.log("No users found");

    let counts = { success: 0, skip: 0, error: 0 };

    for (const user of users) {
      try {
        const interests = [
          ...(user.tags || []),
          ...(user.facts || []),
          user.likes,
          user.looking_for
        ].filter(Boolean).join(", ");

        if (!interests) {
          counts.skip++;
          continue;
        }

        console.log(`Processing ${user.name} (${user.id})`);

        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: interests,
        });

        const embedding = embeddingResponse.data[0].embedding;

        const { error: updateError } = await supabase
          .from('users')
          .update({ embedding })
          .eq('id', user.id);

        if (updateError) throw updateError;

        const { data: verifiedUser } = await supabase
          .from('users')
          .select('embedding')
          .eq('id', user.id)
          .single();

        if (verifiedUser?.embedding) {
          console.log(`Updated ${user.name}`);
          counts.success++;
        } else {
          throw new Error("Verification failed");
        }

        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (err) {
        console.error(`Failed on ${user.name}:`, err);
        counts.error++;
      }
    }

    console.log(`
      Results:
      Total: ${users.length}
      Success: ${counts.success}
      Skipped: ${counts.skip}
      Errors: ${counts.error}
    `);
  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
  }
}

generateEmbeddingsForUsers();