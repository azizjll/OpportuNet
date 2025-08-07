import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Question {
  id?: number;
  contenu: string;
  reponse?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl = 'http://localhost:8080/api/question';

  constructor(private http: HttpClient) {}

  ajouterQuestions(offreId: number, questions: Question[]) {
    const token = localStorage.getItem('token'); // ou via un AuthService
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${this.baseUrl}/offres/${offreId}/questions`, questions, { headers });
  }

  getQuestionsByOffre(offreId: number) {
  const token = localStorage.getItem('token'); // ou utilise ton AuthService si tu en as un
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get<Question[]>(`${this.baseUrl}/offres/${offreId}/questions`, { headers });
}

soumettreReponses(candidatureId: number, reponses: any[]) {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.post(
    `${this.baseUrl}/candidatures/${candidatureId}/reponses`,
    reponses,
    {
      headers,
      responseType: 'text'  // ✅ << Important ici
    }
  );
}

getQuestionsEtReponses(offreId: number, candidatureId: number, token: string) {
  return this.http.get<any[]>(`${this.baseUrl}/offres/${offreId}/candidatures/${candidatureId}/reponses`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}




}
