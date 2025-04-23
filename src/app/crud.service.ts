import { Injectable } from '@angular/core';
import { Database, ref, get, set, push, update, remove, onValue, DataSnapshot } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CrudService {
  constructor(private db: Database) {}

  getList(node: string): Observable<any[]> {
    return new Observable(observer => {
      const listRef = ref(this.db, node);
      return onValue(listRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        const arr = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value as object })) : [];
        observer.next(arr);
      });
    });
  }

  getRecord(node: string, id: string): Promise<any> {
    return get(ref(this.db, `${node}/${id}`)).then(snap => ({ id, ...snap.val() }));
  }

  createRecord(node: string, value: any): Promise<any> {
    const listRef = ref(this.db, node);
    const newRef = push(listRef);
    return set(newRef, value);
  }

  updateRecord(node: string, id: string, value: any): Promise<any> {
    return update(ref(this.db, `${node}/${id}`), value);
  }

  deleteRecord(node: string, id: string): Promise<any> {
    return remove(ref(this.db, `${node}/${id}`));
  }
}
