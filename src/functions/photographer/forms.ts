import { Response } from "express";
import { ProtectedHttpRequest } from "../../types/Http";
import { methodHandler } from "../../utils/methodHandler";
import { ListFormsController } from "../../controllers/photographer/forms/ListFormsController";
import { CreateFormController } from "../../controllers/photographer/forms/CreateFormController";
import { GetFormController } from "../../controllers/photographer/forms/GetFormController";
import { UpdateFormController } from "../../controllers/photographer/forms/UpdateFormController";
import { DeleteFormController } from "../../controllers/photographer/forms/DeleteFormController";

export async function handleForms(
  req: { method: string },
  res: Response,
  request: ProtectedHttpRequest,
  formId?: string,
) {
  if (formId) {
    request.params = { id: formId };
    await methodHandler(req, res, {
      GET: () => GetFormController.handle(request),
      PUT: () => UpdateFormController.handle(request),
      DELETE: () => DeleteFormController.handle(request),
    });
    return;
  }

  await methodHandler(req, res, {
    GET: () => ListFormsController.handle(request),
    POST: () => CreateFormController.handle(request),
  });
}
