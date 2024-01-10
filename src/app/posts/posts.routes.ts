import { Routes } from "@angular/router";
import { leavePageGuard } from "../guards/leave-page.guard";
import { numericIdGuard } from "../guards/numeric-id.guard";
import { postResolver } from "./resolvers/post.resolver";

export const postsRoutes: Routes = [
    {
        path: "",
        title: "Posts | AssBook Lite",
        loadComponent: () =>
            import("./posts-page/posts-page.component").then(
                (m) => m.PostsPageComponent
            ),
    },
    {
        path: "add",
        title: "Add a post | AssBook Lite",
        canDeactivate: [leavePageGuard],
        loadComponent: () =>
            import("./post-form/post-form.component").then(
                (m) => m.PostFormComponent
            ),
    },
    {
        path: ":id",
        title: "Post detail | AssBook Lite",
        canActivate: [numericIdGuard],
        resolve: { post: postResolver },
        loadComponent: () =>
            import("./post-detail/post-detail.component").then(
                (m) => m.PostDetailComponent
            ),
    },
];
