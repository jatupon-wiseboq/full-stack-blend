# Boilerplate for StackBlend Platform

The purpose of this repository is for forking and being used with StackBlend platform. The forked repository will be your assets under the MIT license, while the editor is under the BSD 4-Clause license. ([read more on terms of service, section 2: Use License](https://www.softenstorm.com/stackblend-policy-and-terms)).

Please go to https://www.stackblend.org to get started. Please note that a dedicated GitHub account for StackBlend is recommended while it is underdevelopment.

## Running boilerplate in local machine

You might clone the repository and run it in your local machine for advanced debugging. We recommend to do it, because you can reverse changes or merge conflicts, can change a part of code and see what will be happening, can lint and fix code bugs before deploying, and can install new modules via npm package managing.

1. Signup and Login to GitHub.
2. Create a project and name it.
3. Open a terminal, run "git clone git@github.com:SoftenStorm/boilerplate.git".
4. Run "mv boilerplate YOUR_PROJECT_NAME".
5. Run "cd YOUR_PROJECT_NAME".
6. Run "git remote rename origin boilerplate".
7. Run "git remote add origin git@github.com:YOUR_ALIAS/YOUR_PROJECT_NAME.git".
8. Run "git checkout 1.21".
9. Run "git checkout -b staging".
10. Run "git push --set-upstream origin staging --force".
11. Run "git checkout -b develop".
12. Run "git push --set-upstream origin develop --force".
13. Run "git checkout -b feature/YOUR_NEW_FEATURE_NAME".
14. Run "git push --set-upstream origin feature/YOUR_NEW_FEATURE_NAME --force".
15. Run "npm install".
16. Run "mv dev.env .env" and config the file.
17. Connecting the repository with StackBlend Studio (see the instruction below).
18. Within StackBlend Studio, click save button to push changes to feature/YOUR_NEW_FEATURE_NAME" including new auto-generated files.
19. From the terminal, run "git reset --hard & git pull".
20. Run "npm run build".
21. Run "npm run watch".

Required parameters in the environment file:

1. POSTGRESQL_URL=
2. RELATIONAL_DATABASE_KEY=POSTGRESQL_URL
3. MONGODB_URI=
4. DOCUMENT_DATABASE_KEY=MONGODB_URI
5. REDIS_URI=
6. PRIORITIZED_WORKER_KEY=REDIS_URI
7. VOLATILE_MEMORY_KEY=REDIS_URI
8. SESSION_SECRET=

Heroku is a cloud platform as a service (PaaS) supporting several programming languages, including Node.js, that you may use a free of Heroku dynos for web and worker to run your project. They also provides a free Heroku Postgres and a free Heroku Redis, too. Moreover, on MongoDB.com, they also provides the database service for free. And to reduce traffics to the dynos, please serving cache through a CDN instead by using a free CDN from Cloudflare to achieve it. They will ask you to enter your credit card, but with all of these with the right data-flow optimization techniques, you can serve the high amount of traffics without any costs.

Heroku: https://www.heroku.com
MongoDB: https://www.mongodb.com
Cloudflare: https://www.cloudflare.com

Please generate a random string of SESSION_SECRET using:

1. Run "npm install -g generate-secret".
2. Enter ".env".
3. Enter "SESSION_SECRET".

Finally, openning the preview URL in your browser by using: https://localhost.stackblend.org.

## Running boilerplate on Heroku

This repository has been designed to be working on Heroku. You may following with these instruction to get your project works on the platform.

1. Signup and Login on Heroku.com.
2. Create a new pipeline and connect the pipeline to the GitHub account.
3. On the pipeline page, add an app for staging environment.
4. On the app's resource page, create a new add-on "Heroku Postgres", and wait until it's running.
5. On the app's settings page, config a new variable named "POSTGRESQL_URL", 
   and also point "RELATIONAL_DATABASE_KEY" to it using the name.
6. On the app's resource page, create a new add-on "Heroku Redis".
7. On the app's settings page, config a new variable named "REDIS_URI",
   and also point "PRIORITIZED_WORKER_KEY" and "VOLATILE_MEMORY_KEY" to it using the name.
8. Signup and Login on MongoDB.com.
9. Create a new database on MongoDB.
10. On the app's settings page, config a new variable named "MONGODB_URI",
    and also point "DOCUMENT_DATABASE_KEY" to it using the name.
11. Add a config variable "SESSION_SECRET" and assign the random string.
12. Add a config variable "NODE_ENV" and assign "staging".
13. Configure an automatic deploy or deploy a staging branch.

Openning https://YOUR_APP_NAME.herokuapp.com in your browser to see the results.

## Updating boilerplate periodically

This boilerplate is designed for incremental update for any underlying supports of new features in StackBlend Studio. After StackBlend has released a new version, you must merge the new changes into your project, to make it works on StackBlend.org. Please note that for all of the old versions, you must perform "git cherry-pick COMMIT_ID" for all of hotfixes, beginning with a prefix "Hotfix:" in the message, that may apply to your current using version.

1. Run "git stash".
2. Run "git fetch boilerplate 1.21".
3. Run "git merge 1.21 --allow-unrelated-histories".
4. Run "git stash apply".

To list all of hotfixes:

1. Run "git checkout 1.21".
2. Run "git pull".
3. Run "git log --oneline | grep Hotfix".
4. For each of hotfix, run "git cherry-pick COMMIT_ID".

## Connecting the repository with StackBlend Studio

Whatever you are a full-stack engineer or not, StackBlend will helps you cope with front-end, back-end, UI/UX, and content in a single one editor. You may design the user interface right from the editor, configure their properties and data dot notations, link them to fully customizable server-side scripts, and get the results back on the client-side using less than 10 lines of code, where the rests are auto-generated by the editor.

To get started:

1. Signup and Login to StackBlend at https://www.stackblend.org/account/authenticate.
2. Go to Settings at https://www.stackblend.org/account/settings.
3. Connect to a newly created GitHub account (dedicatedly for StackBlend platform).
4. From Organization Or User Alias, enter "YOUR_ALIAS".
5. From Project Name, enter "YOUR_GITHUB_PROJECT_NAME".
6. From Feature Branch, enter "feature/YOUR_NEW_FEATURE_NAME".
7. From Develop Branch, enter "develop".
8. From Staging Branch, enter "staging".
9. From Endpoint, enter "https://localhost.stackblend.org".

## Restoring malformed project files from regular updates

Because we often release regular updates on stackblend.org, which right now is version 1.21. If you preferred one that you were working with, please run the editor cloned from the releases of full-stack-blend instead. Where you may find out the current version that you are using from README.md file.

You might also reset the project files by cloning a boilerplate from the releases with the same version as the editor. Copy only project.stackblend file from your old project to the new one, open it using the editor and navigate to each of pages, components, and popups.

## Questions?

For any questions, please send an email to [jatupon@softenstorm.com](mailto:jatupon@softenstorm.com).
