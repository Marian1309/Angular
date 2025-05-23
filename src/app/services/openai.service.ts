import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { Observable, from, switchMap } from 'rxjs';
import { HttpResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey:
        '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',
      dangerouslyAllowBrowser: true,
    });
  }

  getChatCompletion(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ): Observable<HttpResponse<string>> {
    return from(
      this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        stream: true,
      })
    ).pipe(
      switchMap(async (stream) => {
        const body = await this.processStream(stream);
        return new HttpResponse<string>({
          body,
          status: 200,
          headers: new HttpHeaders(),
        });
      })
    );
  }

  private async processStream(
    stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
  ): Promise<string> {
    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
    }
    return fullResponse;
  }
}
