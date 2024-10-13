const chatReq = async (query, openai) => {
    console.log("here");
    
    try {
        const message = "Which is the capital of Albania?";
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
          temperature: 0,
          max_tokens: 1000,
        });
        console.log(response);
        
        return response.json()
        // res.status(200).json(response);
      } catch (err) {
        console.log(err);
        
        // res.status(500).json(err.message);
        return "Could not process your request"
      }
}

module.exports = {
    chatReq
}