We used Supabase in this project to store the data we generated.
  
  Here is the users table stored as a csv: https://drive.google.com/file/d/1bS97ubTvl2fUoZBupC_MaQvUDPvcudYo/view?usp=sharing
  
  Here is the users table as an SQL file: https://drive.google.com/file/d/1ewg6qSsO3_tm4ech__teoWNYPRNzq2U0/view?usp=sharing

You should be able to load the table into Supabase using either one of those formats.


We run the project using yarn. After cloning the repo, you can install using "yarn install". You can then run the project on localhost using "yarn run dev".

If you wish to test the embedding script, simply run "yarn generate-embeddings" to generate new vector embeddings based on the info currently in the users table.
