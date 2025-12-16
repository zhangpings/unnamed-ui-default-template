import {
  Attachment,
  AttachmentAdapter,
  CompleteAttachment,
  PendingAttachment,
} from "@assistant-ui/react";
import { nanoid } from "nanoid";
import { uploadChatFile } from "@/runtime/smartvisionApi";

export const smartVisionFileAttachmentAdapter: AttachmentAdapter = {
  accept:
    "image/*, text/plain, text/html, text/markdown, text/csv, text/xml, text/json, text/css",
  async add({ file }: { file: File }): Promise<PendingAttachment> {
    return {
      id: nanoid(),
      type: file.type.startsWith("image/") ? "image" : "file",
      name: file.name,
      file,
      contentType: file.type,
      status: { type: "requires-action", reason: "composer-send" },
    };
  },
  async remove(attachment: Attachment) {
    // noop
  },
  async send(attachment: PendingAttachment) {
    const data = await uploadChatFile(attachment.file);
    return {
      ...attachment,
      id: data.id,
      status: { type: "complete" },
      content: [
        {
          type: "file",
          mimeType: attachment.contentType,
          filename: attachment.name,
          data: "",
        },
      ],
    };
  },
};
