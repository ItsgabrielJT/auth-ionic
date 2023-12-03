
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationService } from './authentication.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { getDocs, query } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
}

export interface Message {
  //  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  currentUserId: string;
  public users: Observable<any>;
  public chatRooms: Observable<any>;
  public selectedChatRoomMessages: Observable<any>

  constructor(
    private api: ApiService,
    public auth: AuthenticationService
  ) {
    this.getId()
  }

  getId() {
    this.currentUserId = this.auth.getId()
    console.log(this.currentUserId)
  }

  getUsers() {
    this.users = this.api.collectionDataQuery(
      'users',
      this.api.whereQuery('uid', '!=', this.currentUserId)
    )
  }

  async createChatRooms(user_id: any) {
    try {
      let room: any;
      const querySnapshot = await this.api.getDocs(
        'chatRooms',
        this.api.whereQuery(
          'members',
          'in',
          [[user_id, this.currentUserId], [this.currentUserId, user_id]]
        )
      );

      room = await querySnapshot.docs.map((doc: any) => {
        let item = doc.data();
        item.id = doc.id;
        return item;
      })

      if (room?.lengt > 0) return room[0];
      const data = {
        members: [
          this.currentUserId,
          user_id
        ],
        type: 'private',
        createdAt: new Date(),
        updateAt: new Date(),
      };
      room = await this.api.addDocument('chatRooms', data);
      return room;
    } catch (error) {
      throw (error);
    }
  }

  getChatRoom() {

    this.chatRooms = this.api.collectionDataQuery(
      'chatRooms',
      this.api.whereQuery('members', 'array-contains', this.currentUserId),

    ).pipe(
      map((data: any[]) => {
        data.map((item: any) => {
          const user_data = item.members.filter((x: any) => x != this.currentUserId);
          const user = this.api.docDataQuery(`users/${user_data[0]}`, true);
          item.user = user;
        });
        return data;
      }),
      switchMap(data => {
        return of(data);
      })
    )
  }

  getChatRoomMessages(chatRoomId: any) {
    this.selectedChatRoomMessages = this.api.collectionDataQuery(
      `chats/${chatRoomId}/messages`,
      this.api.orderByQuery('createdAt', 'desc')
    )
      .pipe(map((arr: any) => arr.reverse()))
  }

  async sendMessage(id: any, msg: any) {
    try {
      const newMessage = {
        message: msg,
        sender: this.currentUserId,
        createdAt: new Date()
      }
      if (id) {
        await this.api.addDocument(`chats/${id}/messages`, newMessage)

      }
    } catch (error) {
      throw (error)
    }
  }

}

