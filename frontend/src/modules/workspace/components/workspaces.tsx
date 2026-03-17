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
  ItemDescription,
  ItemTitle,
  ItemGroup,
  ItemMedia,
} from "@/shared/components/ui/item";
import { Card } from "@/shared/components/ui/card";
import { MonitorCloud, ArrowRight } from "lucide-react";
import { useState } from "react";
import CreateWorkSpace from "./forms/CreateWorkSpace";
import { WorkspaceRes } from "../workspace.types";

const Workspaces = () => {
  const [isCreate, setIsCreate] = useState(false);
  const { data: workspaces, isLoading, error } = useWorkspaces();

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
        <div className="flex flex-col items-center mb-5">
          <div className="flex justify-content-center items-center gap-2">
            <h1 className="scroll-m-20 pb-2 text-4xl font-semibold tracking-tight first:mt-0">
              Welcome
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
          {workspaces?.length > 0 ? (
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
                        <Image
                          src={workspace.logo!}
                          alt={workspace.name}
                          width={32}
                          height={32}
                          className="object-cover grayscale"
                        />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle className="line-clamp-1">
                          {workspace.name} -{" "}
                          {/* <span className="text-muted-foreground">
                            {workspace.album}
                          </span> */}
                        </ItemTitle>
                        <ItemDescription>{new Date(workspace.createdAt).toDateString()}</ItemDescription>
                      </ItemContent>
                      <ItemContent className="flex-none text-center">
                        <ArrowRight className="text-primary" />
                      </ItemContent>
                    </a>
                  </Item>
                ))}
              </ItemGroup>
            </div>
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
                <CustomButton
                  variant="default"
                  onClick={() => setIsCreate(true)}
                >
                  Create Workspace
                </CustomButton>
                <CustomButton variant="outline">Join Workspace</CustomButton>
              </EmptyContent>
            </Empty>
          )}
        </Card>
      </div>
    </>
  );
};

export default Workspaces;
