import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { HistoryItem } from '../../models/history-item.model';



@Injectable({

  providedIn: 'root'

})

export class HistoryService {

 

  private historySubject = new BehaviorSubject<HistoryItem[]>([]);

  public history$: Observable<HistoryItem[]> = this.historySubject.asObservable();



  constructor() { }



 

  addHistoryItem(item: HistoryItem): void {

    const currentHistory = this.historySubject.getValue();

    const updatedHistory = [...currentHistory, item];

    this.historySubject.next(updatedHistory);

  }



  clearHistory(): void {

    this.historySubject.next([]);

  }



  getHistorySnapshot(): HistoryItem[] {

    return this.historySubject.getValue();

  }
}