from openai import AzureOpenAI
import sys

def main(cache, current_prompt):
  # gets the API Key from environment variable AZURE_OPENAI_API_KEY
    client = AzureOpenAI(
        api_key="f3e58d461386493b80a01da24c64e018",
        # https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#rest-api-versioning
        api_version="2023-07-01-preview",
        #api_version="2024-08-06",
        # https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal#create-a-resource
        azure_endpoint="https://llmcopyrightv2.openai.azure.com/",
    )
  
    def prompt_test(prompt):
        PROMPT_MESSAGES = [
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": prompt
            }
            ]
        }
        ]
        params = {
            "model": "V1",
            "messages": PROMPT_MESSAGES,
            "max_tokens": 200,
            "seed": 33,
            "temperature": 0,
            }
        result = client.chat.completions.create(**params)
        return result.choices[0].message.content
    result = prompt_test(f'{cache}. {current_prompt}')
    print(result)


if __name__ == "__main__":
  current_prompt = sys.argv[1]
  cache = sys.argv[2]
  main(cache,current_prompt)
  