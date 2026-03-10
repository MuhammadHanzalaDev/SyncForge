"use client";
import Image from "next/image";
import { useWorkspaces } from "@/modules/workspace/queries/workspace.query";
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
import { MonitorCloud } from "lucide-react";

const Workspaces = () => {
  const { data: res, isLoading, error } = useWorkspaces();

  const workspaces = [
    {
      title: "Midnight City Lights",
      artist: "Neon Dreams",
      album: "Electric Nights",
      duration: "3:45",
    },
    {
      title: "Coffee Shop Conversations",
      artist: "The Morning Brew",
      album: "Urban Stories",
      duration: "4:05",
    },
    {
      title: "Digital Rain",
      artist: "Cyber Symphony",
      album: "Binary Beats",
      duration: "3:30",
    },
  ];

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
    <div className="flex justify-center items-center h-full">
      {res?.data?.length === 0 ? (
        <div className="flex w-full max-w-md flex-col gap-6">
          <ItemGroup className="gap-4">
            {workspaces.map((workspace) => (
              <Item
                key={workspace.title}
                variant="outline"
                asChild
                role="listitem"
              >
                <a href="#">
                  <ItemMedia variant="image">
                    <Image
                      src={`https://avatar.vercel.sh/${workspace.title}`}
                      alt={workspace.title}
                      width={32}
                      height={32}
                      className="object-cover grayscale"
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="line-clamp-1">
                      {workspace.title} -{" "}
                      <span className="text-muted-foreground">
                        {workspace.album}
                      </span>
                    </ItemTitle>
                    <ItemDescription>{workspace.artist}</ItemDescription>
                  </ItemContent>
                  <ItemContent className="flex-none text-center">
                    <ItemDescription>{workspace.duration}</ItemDescription>
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
            <CustomButton variant="default">Create Workspace</CustomButton>
            <CustomButton variant="outline">Join Workspace</CustomButton>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
};

export default Workspaces;
