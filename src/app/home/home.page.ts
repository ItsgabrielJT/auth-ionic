import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { NavigationExtras, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  email: any
  segment = 'chats';

  users: Observable<any>;
  chatRooms: Observable<any>;
  openNewChats: boolean = false;


  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthenticationService,
    private chatService: ChatService
  ) { }

  async toastPresent(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2500,
      position: 'middle',
    });

    await toast.present();
  }

  ngOnInit(): void {
    this.getUsers();
    this.getRooms()
  };

  getRooms() {
    this.chatService.getChatRoom();
    this.chatRooms = this.chatService.chatRooms;
    console.log(this.chatRooms)
  }

  async singOut() {
    const loading = await this.loadingCtrl.create()
    await loading.present();
    this.authService.singOut().then(() => {
      loading.dismiss();
      this.router.navigate(['/login']);
    })
      .catch(err => {
        this.toastPresent("Error sing out, wait a moment...");
      })
  };

  getChat(item: any) {
    (item?.user).pipe(
      take(1)
    ).subscribe(user_data => {
      const navData: NavigationExtras = {
        queryParams: {
          name: user_data?.email
        }
      };
      this.router.navigate(['/chats', item?.id], navData);
    })
  }

  getUsers() {
    this.chatService.getUsers()
    this.users = this.chatService.users;
  }

  cancel() {
    this.openNewChats = false;
  }

  async startChat(item: any) {
    try {
      const room = await this.chatService.createChatRooms(item?.uid);
      this.cancel();
      const navData: NavigationExtras = {
        queryParams: {
          name: item?.email
        }
      }
      console.log(room)
      this.router.navigate(['/chats', room?.id], navData);
    } catch (error) {
      throw (error);
    }
  }

  getUser(user: any) {
    return user;
  }

}
