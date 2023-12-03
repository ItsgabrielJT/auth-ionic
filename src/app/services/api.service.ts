import { Injectable } from '@angular/core';
import { setDoc, doc, Firestore, collectionData, docData } from '@angular/fire/firestore'
import { FieldPath, OrderByDirection, addDoc, collection, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private firestore: Firestore,
  ) { }

  docRef(path: any) {
    return doc(this.firestore, path)
  }

  collectionRef(path: any) {
    return collection(this.firestore, path);
  }


  addDocument(path: any, data: any) {
    const dataRef = this.collectionRef(path);
    return addDoc(dataRef, data);
  }


  setDocument(path: any, data: any) {
    const dataRef = this.docRef(path);
    return setDoc(dataRef, data)
  }

  getDocById(path: any) {
    const dataRef = this.docRef(path);
    return getDoc(dataRef)
  }

  collectionDataQuery(path: any, queryFn: any) {
    let dataRef: any = this.collectionRef(path)
    if (queryFn) {
      const q = query(dataRef, queryFn)
      dataRef = q
    }

    const collection_data = collectionData<any>(dataRef, { idField: 'id' });
    return collection_data;
  }

  getDocs(path: any, queryFn: any) {
    let dataRef: any = this.collectionRef(path);
    if (queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    return getDocs(dataRef);
  }

  whereQuery(fieldPath: any, condition: any, value: any) {
    return where(fieldPath, condition, value);
  }

  docDataQuery(path: any, queryFn: any) {
    let dataRef: any = this.docRef(path);
    if (queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    let doc_data = docData<any>(dataRef, { idField: 'id' });
    return doc_data;
  }

  orderByQuery(fieldPath: any, directionStr: OrderByDirection = 'asc') {
    return orderBy(fieldPath, directionStr);
  }

}
