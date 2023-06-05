# NE1-FREELANCE: A Professional Web-Based Freelancing Platform Built with React, Node, and Express
![image](https://user-images.githubusercontent.com/62683196/216718671-c5618604-ad2c-4723-b191-1feb053ed94e.png)

## Key Features
- Secure User Authentication: Effortless sign-up, login, and logout with user-friendly interface.
- Job Listing Management: Create, edit, and delete job listings with ease.
- Search Functionality: Find the perfect job quickly with advanced search options such as job title, description, and category.
- User-Friendly Display: View job listings in a visually appealing grid format with key details such as job title, description, category, user, and price.

## Getting Started
Before setting up the project locally, make sure you have the following software installed on your computer:
- Node.js
- npm (Node package manager)
- yarn (Node package manager)

Here's a step-by-step guide to setting up NE1-FREELANCE on your local machine:

1. Clone the repository to your local machine by running the following command in your terminal or via the GitHub application:
``` git clone https://github.com/A-Hazzard/NE1-FREELANCE---node.js.git ```

2. Navigate to the project directory: 
``` cd NE1-FREELANCE---node.js ```

3. Install the required packages:
    If you do not have yarn installed on your local machine, run this command 
``` npm install yarn -g ```
    
    Now install
``` yarn install ```


4. Start the react server(make sure that you are in the root folder):
``` yarn start ```

5. Start the api server for data handling (open a new terminal tab/window)
- Navigate into the api server directory
``` cd apiServer ```
- run the api server
``` yarn start ```

### If you are experiencing any issues with yarn, follow this guideline:
1. Verify Yarn installation: Double-check that Yarn is installed globally by running the following command: npm list --global yarn. 
This command will display the installed packages and their versions. If Yarn is listed, it means it is installed.

2. Add Yarn to PATH: If Yarn is installed but not recognized as a command, you need to add the Yarn installation directory to your system's PATH environment variable. Here's how you can do it:

3. Open the "System Properties" dialog on your Windows computer. You can do this by right-clicking on the "This PC" or "My Computer" icon and selecting "Properties." 

4. In the System Properties dialog, click on the "Advanced system settings" link. In the System Properties window, click on the "Environment Variables" button. 

5. In the Environment Variables dialog, find the "Path" variable under "System variables" and click on "Edit." In the Edit Environment Variable dialog, click on "New" and add the directory path where Yarn is installed. 

6. By default, it is installed in the %AppData%\npm directory. So, you can add %AppData%\npm to the Path variable. 

7. Click "OK" to save the changes and close all the dialogs. 

8. Open a new command prompt or restart your computer for the changes to take effect. Verify Yarn command: After adding Yarn to the PATH, open a new command prompt and run yarn --version again. It should now recognize the command and display the version of Yarn installed.

- By following these steps, you should be able to resolve the issue and use Yarn globally on your Windows system

### Important Note: The website will not function as intended without running the development server. Additionally, much of the CSS was built with SASS, so you will need to install a SASS compiler if you plan on making style changes.

## Contributions Welcome
NE1-FREELANCE is an open source project and contributions from the community are always welcome. If you would like to contribute or have any questions, feel free to fork the repository and make changes, or get in touch with the author via social media, links on their profile.

## Author
Aaron Hazzard
