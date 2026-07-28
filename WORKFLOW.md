# AI Prompting Workflow Comparison

This assignment compares how the quality of AI-generated code changes when using a vague prompt versus a detailed prompt.

In the first round, I used a very simple prompt: "Build me a settings form." I accepted the generated output without giving any additional instructions. Cursor created a basic settings form with HTML, CSS, and JavaScript. It contained a password field but did not include a confirm password field. It also generated an additional README.md file inside the settings-form folder. Although the form worked, I had to spend more time reviewing the code to understand what the AI had created and whether it matched my expectations.

In the second round, I started a fresh AI chat and used a detailed prompt with specific requirements. I clearly mentioned the required fields, validation rules, accessibility requirements, code organization, and verification steps. Cursor followed the instructions much more accurately. The generated form included both Password and Confirm Password fields, separated the HTML, CSS, and JavaScript into different files, and focused on the requested functionality without creating an unnecessary README file.

Comparing both versions showed that detailed prompts produce more predictable and useful results. The second version required less manual review because the requirements were clearly defined before the AI started generating code. The code structure was easier to understand, and the generated solution matched the requested feature more closely.

One AI mistake I noticed was that the first version did not include a Confirm Password field, even though it is commonly expected in a settings form. This demonstrated that AI can make reasonable assumptions, but those assumptions may not always match the project requirements. I learned that providing clear specifications, constraints, and verification instructions produces higher-quality code while reducing the amount of manual correction needed.