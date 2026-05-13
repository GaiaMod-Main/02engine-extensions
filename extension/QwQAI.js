class QwQAIExtension {
	///Translated by Gaia
  constructor(runtime) {
    this.runtime = runtime;
    this.apiKey = "sk-W0rpStc95T7JVYVwDYc29IyirjtpPPby6SozFMQr17m8KWeo";
    this.apiUrl = "https://api.suanli.cn/v1";
    this.defaultModel = "free:QwQ-32B";
  }

  getInfo() {
    return {
      id: "qwqai",
      name: "QwQ AI",
      blocks: [
        {
          opcode: "sendChat",
          blockType: Scratch.BlockType.REPORTER,
          text: "Message [MESSAGE] Model used [MODEL]",
          arguments: {
            MESSAGE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "What did you think of 02Engine?"
            },
            MODEL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: this.defaultModel
            }
          }
        },
        {
          opcode: "setAPIKey",
          blockType: Scratch.BlockType.COMMAND,
          text: "Set API key: [KEY]",
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: this.apiKey
            }
          }
        },
        {
          opcode: "setAPIUrl",
          blockType: Scratch.BlockType.COMMAND,
          text: "Set API URL: [URL]",
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: this.apiUrl
            }
          }
        },
        {
          opcode: "setDefaultModel",
          blockType: Scratch.BlockType.COMMAND,
          text: "Set default model: [MODEL]",
          arguments: {
            MODEL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: this.defaultModel
            }
          }
        }
      ],
      menus: {
        models: {
          acceptReporters: true,
          items: [
            "free:QwQ-32B",
            "gpt-3.5-turbo",
            "gpt-5.2-chat-latest",
            "gpt-4",
            "claude-2",
            "gemini-2.0-flash",
            "gemini-2.5-flash-lite",
            "deepseek-math-7b-instruct",
            "deepseek-coder-6.7b-instruct-awq",
            "deepseek-coder-6.7b-base-awq",
            "llama-3.1-8b-instruct-fast",
            "Other models"
          ]
        }
      }
    };
  }

  sendChat(args) {
    const message = args.MESSAGE;
    const model = args.MODEL || this.defaultModel;
    
    return this._callAPI(message, model);
  }

  setAPIKey(args) {
    this.apiKey = args.KEY;
  }

  setAPIUrl(args) {
    this.apiUrl = args.URL;
  }

  setDefaultModel(args) {
    this.defaultModel = args.MODEL;
  }

  async _callAPI(message, model) {
    const requestData = {
      model: model,
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    };

    try {
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "You have not received a message yet";
    } catch (error) {
      console.error("Tuning API output:", error);
      return `Error: ${error.message}`;
    }
  }
}


Scratch.extensions.register(new QwQAIExtension());