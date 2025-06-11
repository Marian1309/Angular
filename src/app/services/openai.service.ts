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
