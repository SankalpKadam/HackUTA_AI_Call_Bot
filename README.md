![image](https://github.com/user-attachments/assets/3818b39e-53bb-437d-a8a0-2d07d77c5b4a)

## 🌟 Inspiration
Waiting on hold is a universal pain—whether it’s calling restaurants, insurance companies, or any other business. BotKonnect aims to **eliminate wait times** and **enhance customer satisfaction** by automating and streamlining customer service with AI-driven call bots!

## 🧐 Problem Statement
Businesses face high operational costs and inefficient service delivery due to long hold times and repetitive tasks. Customers, in turn, experience delays and dissatisfaction.

## 💡 Proposed Solution
With **BotKonnect**, businesses can instantly connect with customers through AI-powered bots that:
- Answer questions
- Take orders
- Direct calls to the right department
- Provide real-time, accurate responses

## 🔄 Pipeline
1. **Owner Registration**: React & Tailwind frontend portal where business owners register and receive a Twilio number.
2. **AI-Powered Call Handling**: Twilio records customer input, which is processed through OpenAI API.
3. **Backend Processing**: Node.js & Express server to manage requests, with data stored in MongoDB.
4. **Customer Insights**: Portal provides customer data and analytics for business owners.

## 🔍 Industry Analysis
- **Customer service automation** is growing rapidly, with AI adoption projected to reach 70% of customer interactions by 2025.
- BotKonnect positions businesses to **reduce costs** and **increase customer satisfaction**, giving them a competitive edge.

## 🚀 Future Scope
- **Multilingual Support** 🌎: Expand to cater to a global audience.
- **Advanced Analytics** 📊: Deeper insights into customer behavior and engagement trends.
- **CRM Integration** 🤝: Integrate with CRM systems for streamlined data management.

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express
- **APIs**: Twilio, OpenAI API
- **Database**: MongoDB

## 📸 Screenshots
![image](https://github.com/user-attachments/assets/f9827fb0-fa4d-4482-858b-c6b73b0e1252)

![image](https://github.com/user-attachments/assets/7c582c22-ea94-4dd6-96de-c5c96513db98)


## 📝 How to Get Started
### 0. Clone the repository:  
```bash
git clone https://github.com/SankalpKadam/HackUTA_AI_Call_Bot
```

### 1. Setting up the Frontend

1. Navigate to the frontend directory:
```bash
cd frontend/BotConnect/
```

2.Install dependencies:
```bash
npm install
```

3. Start the development server:
   
```bash
   npm run dev
```

### 2. Setting up the Twilio Service
1. Navigate to the Twilio service directory:
```bash
cd TwilioService/
```

2. Install the required dependencies:
```bash
npm install
```

3. Ensure you have the OPENAI_API_KEY in your .env file inside the TwilioService/ directory.

4. Add the following line to your .env file:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

5. Start the Twilio service:
```bash
node index.js
```

### 3. Running Call Services

1. In a new terminal window, navigate to the TwilioService/ directory (if you're not already there).

2. Run the following command to start the GPT call service:
```bash
node gpt.js
```

## 📬 Contributing
Contributions are welcome! Please fork the repository and submit a pull request. Check out the issues tab for ideas or to report bugs.

## 🛡️ License
This project is licensed under the MIT License. Check the LICENSE file for details.
