/**
 * ACTION_BUTTONS Usage Examples
 * 
 * This file demonstrates different ways to use the enhanced ACTION_BUTTONS
 * with auto-routing support in ListGrid components.
 */

"use client";

import { ListGrid, Columns } from "@/components/ui/ListGrid";
import { ACTION_BUTTONS, ADD_BUTTON } from "@/components/ui/Button/ActionButtons";
import { useRouter } from "next/navigation";

// ============================================
// EXAMPLE 1: Simple Auto-Routing (RECOMMENDED)
// ============================================

interface Post {
  id: string;
  title: string;
  status: string;
}

export function PostListSimple() {
  const { data, isLoading } = usePosts(); // Your data hook

  const columns: Columns<Post> = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", align: "center" as const },
  ];

  const handleDelete = (id: string) => {
    // Your delete logic
    console.log("Deleting post:", id);
  };

  return (
    <ListGrid<Post>
      title="Posts Management"
      columns={columns}
      data={data}
      loading={isLoading}
      actionButtons={{
        add: ADD_BUTTON.CREATE("/posts/create"),
        
        // ✨ AUTO-ROUTING - Just pass the base path!
        show: ACTION_BUTTONS.SHOW("/posts"),      // → /posts/{id}
        edit: ACTION_BUTTONS.EDIT("/posts"),      // → /posts/{id}/edit
        
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
    />
  );
}

// ============================================
// EXAMPLE 2: Nested Routes Auto-Routing
// ============================================

export function AdminPostList() {
  const { data, isLoading } = useAdminPosts();

  const columns: Columns<Post> = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "actions", label: "Actions", align: "center" as const },
  ];

  return (
    <ListGrid<Post>
      title="Admin Posts"
      columns={columns}
      data={data}
      loading={isLoading}
      actionButtons={{
        // ✨ Works with nested paths too!
        show: ACTION_BUTTONS.SHOW("/admin/posts"),    // → /admin/posts/{id}
        edit: ACTION_BUTTONS.EDIT("/admin/posts"),    // → /admin/posts/{id}/edit
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
    />
  );
}

// ============================================
// EXAMPLE 3: Backward Compatible (Custom Handlers)
// ============================================

export function PostListWithCustomLogic() {
  const router = useRouter();
  const { data, isLoading } = usePosts();

  const columns: Columns<Post> = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "actions", label: "Actions", align: "center" as const },
  ];

  // Custom show handler with analytics
  const handleShow = (id: string) => {
    console.log("Tracking view:", id);
    // Track analytics event
    analytics.track("post_viewed", { postId: id });
    
    // Navigate
    router.push(`/posts/${id}`);
  };

  // Custom edit handler with permissions check
  const handleEdit = (id: string) => {
    // Check permissions
    if (!hasEditPermission()) {
      alert("You don't have permission to edit");
      return;
    }
    
    router.push(`/posts/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    console.log("Deleting:", id);
  };

  return (
    <ListGrid<Post>
      title="Posts with Custom Logic"
      columns={columns}
      data={data}
      loading={isLoading}
      actionButtons={{
        // ✅ OLD WAY - Custom handlers (still works!)
        show: ACTION_BUTTONS.SHOW(handleShow),
        edit: ACTION_BUTTONS.EDIT(handleEdit),
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
    />
  );
}

// ============================================
// EXAMPLE 4: Mixed Usage (Auto + Custom)
// ============================================

export function PostListMixed() {
  const router = useRouter();
  const { data, isLoading } = usePosts();

  const columns: Columns<Post> = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "actions", label: "Actions", align: "center" as const },
  ];

  // Only need custom logic for show
  const handleShow = (id: string) => {
    analytics.track("post_viewed", { postId: id });
    router.push(`/posts/${id}`);
  };

  const handleDelete = (id: string) => {
    console.log("Deleting:", id);
  };

  return (
    <ListGrid<Post>
      title="Posts (Mixed Usage)"
      columns={columns}
      data={data}
      loading={isLoading}
      actionButtons={{
        // ✅ Custom handler for show (needs analytics)
        show: ACTION_BUTTONS.SHOW(handleShow),
        
        // ✨ Auto-routing for edit (no custom logic needed)
        edit: ACTION_BUTTONS.EDIT("/posts"),
        
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
    />
  );
}

// ============================================
// EXAMPLE 5: Using VIEW Alias
// ============================================

export function PostListWithView() {
  const { data, isLoading } = usePosts();

  const columns: Columns<Post> = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "actions", label: "Actions", align: "center" as const },
  ];

  return (
    <ListGrid<Post>
      title="Posts with VIEW"
      columns={columns}
      data={data}
      loading={isLoading}
      actionButtons={{
        // ✨ VIEW is an alias for SHOW - same functionality
        show: ACTION_BUTTONS.VIEW("/posts"),      // → /posts/{id}
        edit: ACTION_BUTTONS.EDIT("/posts"),      // → /posts/{id}/edit
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
    />
  );
}

// ============================================
// EXAMPLE 6: Different Resource Types
// ============================================

// Labels Management
export function LabelList() {
  const { data, isLoading } = useLabels();

  return (
    <ListGrid
      title="Labels"
      columns={labelColumns}
      data={data}
      loading={isLoading}
      actionButtons={{
        add: ADD_BUTTON.CREATE("/labels/create"),
        show: ACTION_BUTTONS.SHOW("/labels"),     // → /labels/{id}
        edit: ACTION_BUTTONS.EDIT("/labels"),     // → /labels/{id}/edit
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
    />
  );
}

// Categories Management
export function CategoryList() {
  const { data, isLoading } = useCategories();

  return (
    <ListGrid
      title="Categories"
      columns={categoryColumns}
      data={data}
      loading={isLoading}
      actionButtons={{
        add: ADD_BUTTON.CREATE("/categories/create"),
        show: ACTION_BUTTONS.SHOW("/categories"),     // → /categories/{id}
        edit: ACTION_BUTTONS.EDIT("/categories"),     // → /categories/{id}/edit
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
    />
  );
}

// Users Management
export function UserList() {
  const { data, isLoading } = useUsers();

  return (
    <ListGrid
      title="Users"
      columns={userColumns}
      data={data}
      loading={isLoading}
      actionButtons={{
        add: ADD_BUTTON.CREATE("/users/create"),
        show: ACTION_BUTTONS.SHOW("/users"),          // → /users/{id}
        edit: ACTION_BUTTONS.EDIT("/users"),          // → /users/{id}/edit
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
    />
  );
}

// ============================================
// EXAMPLE 7: Query Parameters (Custom Handler)
// ============================================

export function PostListWithQueryParams() {
  const router = useRouter();
  const { data, isLoading } = usePosts();

  const columns: Columns<Post> = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "actions", label: "Actions", align: "center" as const },
  ];

  // Need query params? Use custom handler
  const handleEdit = (id: string) => {
    router.push(`/posts/${id}/edit?mode=advanced&ref=dashboard`);
  };

  return (
    <ListGrid<Post>
      title="Posts with Query Params"
      columns={columns}
      data={data}
      loading={isLoading}
      actionButtons={{
        show: ACTION_BUTTONS.SHOW("/posts"),          // ✨ Auto-routing
        edit: ACTION_BUTTONS.EDIT(handleEdit),        // ✅ Custom for query params
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
    />
  );
}

// ============================================
// EXAMPLE 8: Conditional Navigation
// ============================================

export function PostListWithConditions() {
  const router = useRouter();
  const { data, isLoading } = usePosts();
  const { user } = useAuth();

  const columns: Columns<Post> = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "actions", label: "Actions", align: "center" as const },
  ];

  const handleEdit = (id: string) => {
    // Check permission before navigating
    if (!user?.canEdit) {
      toast.error("You don't have permission to edit posts");
      return;
    }

    // Navigate if allowed
    router.push(`/posts/${id}/edit`);
  };

  const handleDelete = (id: string, item?: unknown) => {
    if (!user?.canDelete) {
      toast.error("You don't have permission to delete posts");
      return;
    }

    // Perform delete
    deletePost(id);
  };

  return (
    <ListGrid<Post>
      title="Posts with Permissions"
      columns={columns}
      data={data}
      loading={isLoading}
      actionButtons={{
        show: ACTION_BUTTONS.SHOW("/posts"),          // ✨ Auto-routing
        edit: ACTION_BUTTONS.EDIT(handleEdit),        // ✅ Custom for permissions
        delete: ACTION_BUTTONS.DELETE(handleDelete),  // ✅ Custom for permissions
      }}
    />
  );
}

// ============================================
// EXAMPLE 9: Using Helper Function Directly
// ============================================

import { createAutoRouteHandler } from "@/components/ui/Button/ActionButtons";

export function PostListWithHelpers() {
  const { data, isLoading } = usePosts();

  // Create reusable handlers
  const viewHandler = createAutoRouteHandler("/posts");
  const editHandler = createAutoRouteHandler("/posts", "/edit");

  const columns: Columns<Post> = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "actions", label: "Actions", align: "center" as const },
  ];

  return (
    <ListGrid<Post>
      title="Posts with Helpers"
      columns={columns}
      data={data}
      loading={isLoading}
      actionButtons={{
        // Use pre-created handlers
        show: ACTION_BUTTONS.SHOW(viewHandler),
        edit: ACTION_BUTTONS.EDIT(editHandler),
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
    />
  );
}

// ============================================
// EXAMPLE 10: Complete Real-World Example
// ============================================

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  author: string;
  createdAt: string;
}

export function BlogPostManagement() {
  const { data, isLoading, isError, error } = usePosts();
  const deletePost = useDeletePost();
  const router = useRouter();

  const columns: Columns<BlogPost> = [
    {
      key: "id",
      label: "ID",
      value: (post) => post.id,
    },
    {
      key: "title",
      label: "Title",
      value: (post) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm">{post.title}</span>
          <span className="text-xs text-gray-500">{post.slug}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "center" as const,
      value: (post) => <StatusBadge status={post.status} />,
    },
    {
      key: "author",
      label: "Author",
      value: (post) => post.author,
    },
    {
      key: "createdAt",
      label: "Created",
      value: (post) => formatDate(post.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      align: "center" as const,
    },
  ];

  const handleDelete = async (id: string, item?: unknown) => {
    try {
      await deletePost.mutateAsync(id);
      toast.success("Post deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  };

  return (
    <ListGrid<BlogPost>
      title="Blog Posts Management"
      description="Manage all your blog posts with optimized caching"
      searchPlaceholder="Search by title, slug, or author..."
      columns={columns}
      data={data}
      isError={isError}
      error={error}
      keyField="id"
      idField="id"
      nameField="title"
      loading={isLoading}
      actionButtons={{
        add: ADD_BUTTON.CREATE("/posts/create"),
        
        // ✨ AUTO-ROUTING - Clean and simple!
        show: ACTION_BUTTONS.SHOW("/posts"),
        edit: ACTION_BUTTONS.EDIT("/posts"),
        
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
      deleteConfirmTitle="Delete Post"
      deleteConfirmMessage={(post) =>
        `Are you sure you want to delete "${post.title}"? This action cannot be undone.`
      }
      pageSize={10}
      showPagination={true}
    />
  );
}

// ============================================
// COMPARISON: Before vs After
// ============================================

// ❌ BEFORE (Verbose)
export function PostListBefore() {
  const router = useRouter();
  const { data, isLoading } = usePosts();

  const columns: Columns<Post> = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", align: "center" as const },
  ];

  return (
    <ListGrid<Post>
      title="Posts"
      columns={columns}
      data={data}
      loading={isLoading}
      actionButtons={{
        add: ADD_BUTTON.CREATE("/posts/create"),
        show: ACTION_BUTTONS.SHOW((id) => router.push(`/posts/${id}`)),
        edit: ACTION_BUTTONS.EDIT((id) => router.push(`/posts/${id}/edit`)),
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
    />
  );
}

// ✅ AFTER (Clean)
export function PostListAfter() {
  const { data, isLoading } = usePosts();
  // No need for useRouter anymore!

  const columns: Columns<Post> = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", align: "center" as const },
  ];

  return (
    <ListGrid<Post>
      title="Posts"
      columns={columns}
      data={data}
      loading={isLoading}
      actionButtons={{
        add: ADD_BUTTON.CREATE("/posts/create"),
        show: ACTION_BUTTONS.SHOW("/posts"),      // ✨ Much cleaner!
        edit: ACTION_BUTTONS.EDIT("/posts"),      // ✨ Much cleaner!
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
    />
  );
}

// ============================================
// HELPER FUNCTIONS (for examples)
// ============================================

function usePosts() {
  // Mock data hook
  return { data: [], isLoading: false, isError: false, error: null };
}

function useLabels() {
  return { data: [], isLoading: false };
}

function useCategories() {
  return { data: [], isLoading: false };
}

function useUsers() {
  return { data: [], isLoading: false };
}

function useAdminPosts() {
  return { data: [], isLoading: false };
}

function useDeletePost() {
  return { mutateAsync: async (id: string) => {} };
}

function useAuth() {
  return { user: { canEdit: true, canDelete: true } };
}

function handleDelete(id: string) {
  console.log("Deleting:", id);
}

function deletePost(id: string) {
  console.log("Deleting post:", id);
}

function hasEditPermission() {
  return true;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

const analytics = {
  track: (event: string, data: unknown) => {},
};

const toast = {
  success: (message: string) => {},
  error: (message: string) => {},
};

const labelColumns: Columns<unknown> = [];
const categoryColumns: Columns<unknown> = [];
const userColumns: Columns<unknown> = [];

function StatusBadge({ status }: { status: string }) {
  return <span>{status}</span>;
}
