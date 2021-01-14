import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-external-user',
  templateUrl: './external-user.component.html',
  styleUrls: ['./external-user.component.css']
})
export class ExternalUserComponent implements OnInit {

  user:User;

  constructor(private userService: UserService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = new User("", "", "", "");
    const uid = this.route.snapshot.params['id'];
    this.userService.getSingleUser(uid).then(
      (user:User) => {
        this.user = user;
        console.log(user);
      }
    );
  }

}
