"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/Common/PageHeader";
import { usePost } from "@/services/postsService";
import { Heading } from "@/components/ui/Heading";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PostShow() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { data: postData, isLoading, isError } = usePost(Number(id));

  if (isLoading) {
    return (
      <Container>
        <PageHeader title="Loading post..." />
      </Container>
    );
  }

  if (isError || !postData?.data) {
    return (
      <Container>
        <PageHeader title="Post not found" />
      </Container>
    );
  }

  const post = postData.data;

  return (
    <Container>
      <PageHeader
        actions={
          <>
            <Button
              size="sm"
              variant="bordered"
              startContent={<EditIcon />}
              isIconOnly
              onPress={() => router.push(`/posts/${post.id}/edit`)}
            ></Button>
          </>
        }
        title={`Preview Post: ${post.title}`}
      />

      <Card shadow="sm" className="mt-6">
        <CardHeader className="flex flex-col items-start gap-2">
          <Heading className="text-3xl font-bold">{post.title}</Heading>
          {post.excerpt && (
            <p className="text-default-500 text-sm">{post.excerpt}</p>
          )}
        </CardHeader>

        {post.coverImage && (
          <div className="relative w-full h-[400px]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}

        <CardBody className="prose dark:prose-invert max-w-none pt-6">
          <article dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardBody>
      </Card>
    </Container>
  );
}
