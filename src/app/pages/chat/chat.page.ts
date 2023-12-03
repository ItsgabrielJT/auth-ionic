import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  name: string;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  id: any;
  message: string;
  isLoading: boolean;
  chats: Observable<any[]>
  model = {
    icon: 'chatbubbles-outline',
    title: 'No Conversation',
    color: 'danger'
  }

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public chatService: ChatService,
  ) { }

  ngOnInit() {
    const data: any = this.route.snapshot.queryParams;
    console.log(data);
    if (data?.name) {
      this.name = data.name
    }
    const id = this.route.queryParams.subscribe(
      params => params['id']
    );
    console.log('check id ', id);
    if (!id) {
      this.navCtrl.back();
      return;
    }
    this.id = id;
    this.chatService.getChatRoomMessages(this.id);
    this.chats = this.chatService.selectedChatRoomMessages;
    console.log(this.chats)
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.chats) this.content.scrollToBottom(500);
  }

  async sendMessage() {
    if (!this.message || this.message?.trim() == "") {
      return
    }
    try {
      this.isLoading = true;
      await this.chatService.sendMessage(this.id, this.message);
      this.message = "";
      this.isLoading = false;
      this.scrollToBottom();
    } catch (error) {
      this.isLoading = false;
      throw (error);
    }
  }

}
