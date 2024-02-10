import { Routes } from "@angular/router";
import { leavePageGuard } from "../guards/leave-page.guard";
import { numericIdGuard } from "../guards/numeric-id.guard";
import { postResolver } from "./resolvers/post.resolver";
import { loginActivateGuard } from "../guards/login-activate.guard";
import { commentsResolver } from "./resolvers/comments.resolver";

export const postsRoutes: Routes = [
    {
        path: "",
        title: "Posts | AssBook",
        canActivate: [loginActivateGuard],
        loadComponent: () =>
            import("./posts-page/posts-page.component").then(
                (m) => m.PostsPageComponent
            ),
    },
    {
        path: "add",
        title: "Add a post | AssBook",
        canActivate: [loginActivateGuard],
        canDeactivate: [leavePageGuard],
        loadComponent: () =>
            import("./post-form/post-form.component").then(
                (m) => m.PostFormComponent
            ),
    },
    {
        path: ":id",
        title: "Post detail | AssBook",
        canActivate: [numericIdGuard, loginActivateGuard],
        resolve: { post: postResolver, comments: commentsResolver },
        loadComponent: () =>
            import("./post-detail/post-detail.component").then(
                (m) => m.PostDetailComponent
            ),
    },
    {
        path: ":id/edit",
        title: "Edit post | AssBook",
        canActivate: [numericIdGuard, loginActivateGuard],
        canDeactivate: [leavePageGuard],
        resolve: { post: postResolver },
        loadComponent: () => 
            import("./post-form/post-form.component").then(
                (m) => m.PostFormComponent
            ),
    },
];
