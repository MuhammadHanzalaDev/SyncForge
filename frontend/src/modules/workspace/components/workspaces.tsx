"use client";
import Image from "next/image";
import { useWorkspaces } from "@/modules/workspace/workspace.query";
import { CustomButton, ItemMediaSkeleton } from "@/shared/components";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemGroup,
  ItemMedia,
} from "@/shared/components/ui/item";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Card } from "@/shared/components/ui/card";
import { MonitorCloud, ArrowRight } from "lucide-react";
import { useState } from "react";
import CreateWorkSpace from "./forms/CreateWorkSpace";
import { WorkspaceRes } from "../workspace.types";
import { useRouter } from "next/navigation";

const Workspaces = () => {
  const router = useRouter();
  const [isCreate, setIsCreate] = useState(false);
  const { data: workspaces, isLoading } = useWorkspaces();

  const selectWorkspace = (id: string) => {
    localStorage.setItem("workspace", id);
    router.replace("/")
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex w-full max-w-md flex-col gap-6">
          <ItemGroup className="gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <ItemMediaSkeleton key={idx} />
            ))}
          </ItemGroup>
        </div>
      </div>
    );

  return (
    <>
      <CreateWorkSpace isOpen={isCreate} setIsOpen={setIsCreate} />
      <div className="flex flex-col justify-center items-center h-full">
        {workspaces?.length > 0 ? (
          <>
            <div className="flex flex-col items-center mb-5">
              <div className="flex justify-content-center items-center gap-2">
                <h1 className="scroll-m-20 pb-2 text-4xl font-semibold tracking-tight first:mt-0">
                  Welcome back
                </h1>
                <Image
                  src="/waving-hand.gif"
                  alt="Waving Hand"
                  width={46}
                  height={46}
                />
              </div>
              <p className="text-lg text-muted-foreground">
                Choose a workspace to get started.
              </p>
            </div>
            <Card className="max-w-md p-5">
              <div className="font-semibold text-xl">Workspaces</div>
              <div className="flex w-full max-w-md flex-col gap-6">
                <ItemGroup className="gap-4">
                  {workspaces.map((workspace: WorkspaceRes) => (
                    <Item
                      key={workspace.id}
                      variant="outline"
                      asChild
                      role="listitem"
                      className="w-100"
                    >
                      <a href="#">
                        <ItemMedia variant="image">
                          {workspace.fileId ? (
                            <Image
                              src={workspace.logo!}
                              alt={workspace.name}
                              width={32}
                              height={32}
                              className="object-cover grayscale"
                            />
                          ) : (
                            <MonitorCloud className="text-primary" />
                          )}
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className="line-clamp-1">
                            {workspace.name}
                            {/* <span className="text-muted-foreground">
                            {workspace.album}
                          </span> */}
                          </ItemTitle>
                          <div>
                            <AvatarGroup className="grayscale">
                              {Array.from({
                                length:
                                  workspace.totalMembers > 3
                                    ? 3
                                    : workspace.totalMembers,
                              }).map((_, idx) => (
                                <Avatar key={idx} className="w-6 h-6">
                                  <AvatarImage
                                    src="/images/empty-user-avatar.png"
                                    alt="member"
                                  />
                                  <AvatarFallback>User</AvatarFallback>
                                </Avatar>
                              ))}
                              {workspace.totalMembers > 3 && (
                                <AvatarGroupCount className="w-6 h-6">
                                  +{workspace.totalMembers - 3}
                                </AvatarGroupCount>
                              )}
                            </AvatarGroup>
                          </div>
                        </ItemContent>
                        <ItemContent className="flex-none text-center">
                          <ArrowRight className="text-primary" />
                        </ItemContent>
                      </a>
                    </Item>
                  ))}
                </ItemGroup>
              </div>
              <CustomButton
                variant="link"
                className="m-0 p-0 w-auto h-fit"
                onClick={() => setIsCreate(true)}
              >
                Create New Workspace
              </CustomButton>
            </Card>
          </>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MonitorCloud />
              </EmptyMedia>
              <EmptyTitle>No Workspaces Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any workspace yet. Get started by
                creating your first workspace or joining an existing one.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
              <CustomButton variant="default" onClick={() => setIsCreate(true)}>
                Create Workspace
              </CustomButton>
              <CustomButton variant="outline">Join Workspace</CustomButton>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </>
  );
};

export default Workspaces;
