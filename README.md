Data Preparation and Setup:

	We used Supabase in this project to store the data we generated.

		Here is the users table stored as a csv: https://drive.google.com/file/d/1bS97ubTvl2fUoZBupC_MaQvUDPvcudYo/view?usp=sharing
  
		Here is the users table as an SQL file: https://drive.google.com/file/d/1ewg6qSsO3_tm4ech__teoWNYPRNzq2U0/view?usp=sharing
  
	You should be able to load the table into Supabase using either one of those formats.


Application and Code:

	Make sure to add your own OpenAI and Supabase API keys at the top of utils/api.ts as well as scripts/generate-embedding.ts:
 		api.ts keys: OPENAI_API_KEY, ASSISTANT_ID, OPENAI_API_ENDPOINT
   		generate-embedding.ts keys: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
	
 	We run the project using yarn. After cloning the repo, you can install using "yarn install". You can then run the project on localhost using "yarn run dev".

	If you wish to test the embedding script, simply run "yarn generate-embeddings" to generate new vector embeddings based on the info currently in the users table.


Images of Application:
	![image](https://github.com/user-attachments/assets/b6f12bfa-cb24-4343-8db7-8bef4085d87c)
	![image](https://github.com/user-attachments/assets/00884503-0a61-43cd-b7ab-b60b3e6edfc7)
 	![image](https://github.com/user-attachments/assets/e4652d3e-76be-4620-9c9f-6c890f6b2618)


Note: To see "Edit Profile" functionality, view "navin" branch

