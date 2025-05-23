# # ollama_model.py

# from agno.models.base import BaseModel
# import ollama

# class OllamaModel(BaseModel):
#     def __init__(self, model_name="deepseek"):
#         self.model_name = model_name

#     def complete(self, prompt: str, **kwargs) -> str:
#         response = ollama.chat(
#             model=self.model_name,
#             messages=[{"role": "user", "content": prompt}]
#         )
#         return response["message"]["content"]
