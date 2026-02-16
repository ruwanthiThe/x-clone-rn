const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "JustSocial API",
    version: "1.0.0",
    description: "API documentation for the JustSocial backend.",
  },
  servers: [
    {
      url: "http://localhost:5001",
      description: "Local server",
    },
  ],
  tags: [
    { name: "Users" },
    { name: "Posts" },
    { name: "Comments" },
    { name: "Notifications" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      MessageResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          clerkId: { type: "string" },
          email: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          username: { type: "string" },
          profilePicture: { type: "string" },
          bannerImage: { type: "string" },
          bio: { type: "string" },
          location: { type: "string" },
          followers: { type: "array", items: { type: "string" } },
          following: { type: "array", items: { type: "string" } },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
      },
      Post: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
          content: { type: "string" },
          image: { type: "string" },
          likes: { type: "array", items: { type: "string" } },
          comments: { type: "array", items: { $ref: "#/components/schemas/Comment" } },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
          post: { type: "string" },
          content: { type: "string" },
          likes: { type: "array", items: { type: "string" } },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
      },
      Notification: {
        type: "object",
        properties: {
          _id: { type: "string" },
          from: { $ref: "#/components/schemas/User" },
          to: { type: "string" },
          type: { type: "string", enum: ["follow", "like", "comment"] },
          post: { $ref: "#/components/schemas/Post" },
          comment: { $ref: "#/components/schemas/Comment" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/api/users/profile/{username}": {
      get: {
        tags: ["Users"],
        summary: "Get a user profile by username",
        parameters: [
          {
            name: "username",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "User profile",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { user: { $ref: "#/components/schemas/User" } },
                },
              },
            },
          },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/users/sync": {
      post: {
        tags: ["Users"],
        summary: "Sync the current Clerk user into MongoDB",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User already exists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          201: {
            description: "User created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get the current user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Current user",
            content: {
              "application/json": {
                schema: { type: "object", properties: { user: { $ref: "#/components/schemas/User" } } },
              },
            },
          },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/users/profile": {
      put: {
        tags: ["Users"],
        summary: "Update the current user profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  username: { type: "string" },
                  profilePicture: { type: "string" },
                  bannerImage: { type: "string" },
                  bio: { type: "string" },
                  location: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Updated user",
            content: {
              "application/json": {
                schema: { type: "object", properties: { user: { $ref: "#/components/schemas/User" } } },
              },
            },
          },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/users/follow/{targetUserId}": {
      post: {
        tags: ["Users"],
        summary: "Follow or unfollow a user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "targetUserId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Follow toggle result",
            content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } },
          },
          400: { description: "Invalid follow", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/posts": {
      get: {
        tags: ["Posts"],
        summary: "Get all posts",
        responses: {
          200: {
            description: "Posts",
            content: {
              "application/json": {
                schema: { type: "object", properties: { posts: { type: "array", items: { $ref: "#/components/schemas/Post" } } } },
              },
            },
          },
        },
      },
      post: {
        tags: ["Posts"],
        summary: "Create a post",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  content: { type: "string" },
                  image: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Post created",
            content: {
              "application/json": {
                schema: { type: "object", properties: { post: { $ref: "#/components/schemas/Post" } } },
              },
            },
          },
          400: { description: "Invalid post", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/posts/{postId}": {
      get: {
        tags: ["Posts"],
        summary: "Get a post by id",
        parameters: [
          { name: "postId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Post",
            content: {
              "application/json": {
                schema: { type: "object", properties: { post: { $ref: "#/components/schemas/Post" } } },
              },
            },
          },
          404: { description: "Post not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Posts"],
        summary: "Delete a post",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "postId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Post deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
          403: { description: "Not allowed", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "User or post not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/posts/user/{username}": {
      get: {
        tags: ["Posts"],
        summary: "Get posts by username",
        parameters: [
          { name: "username", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "User posts",
            content: {
              "application/json": {
                schema: { type: "object", properties: { posts: { type: "array", items: { $ref: "#/components/schemas/Post" } } } },
              },
            },
          },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/posts/{postId}/like": {
      post: {
        tags: ["Posts"],
        summary: "Like or unlike a post",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "postId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Like toggled", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
          404: { description: "User or post not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/comments/post/{postId}": {
      get: {
        tags: ["Comments"],
        summary: "Get comments for a post",
        parameters: [
          { name: "postId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Comments",
            content: {
              "application/json": {
                schema: { type: "object", properties: { comments: { type: "array", items: { $ref: "#/components/schemas/Comment" } } } },
              },
            },
          },
        },
      },
      post: {
        tags: ["Comments"],
        summary: "Create a comment on a post",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "postId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  content: { type: "string" },
                },
                required: ["content"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Comment created",
            content: {
              "application/json": {
                schema: { type: "object", properties: { comment: { $ref: "#/components/schemas/Comment" } } },
              },
            },
          },
          400: { description: "Invalid content", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "User or post not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/comments/{commentId}": {
      delete: {
        tags: ["Comments"],
        summary: "Delete a comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "commentId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Comment deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
          403: { description: "Not allowed", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "User or comment not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "Get current user notifications",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Notifications",
            content: {
              "application/json": {
                schema: { type: "object", properties: { notifications: { type: "array", items: { $ref: "#/components/schemas/Notification" } } } },
              },
            },
          },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/notifications/{notificationId}": {
      delete: {
        tags: ["Notifications"],
        summary: "Delete a notification",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "notificationId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Notification deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
          404: { description: "User or notification not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
  },
};

export { swaggerSpec };
