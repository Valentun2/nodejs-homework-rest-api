import { Router } from "express";
import controllers from "../../controllers/contacts.js";
import {authenticate, isEmptyBody,isValidId} from "../../middlewares/index.js";
import { contactAddSchema, contactUpdateSchema ,contactFavoriteSchema} from "../../models/contact.js"
import validateBody from "../../decorators/validateBody.js";
const router = Router();


router.use(authenticate)
router.get("/", controllers.getAllContact);

router.get("/:contactId",isValidId, controllers.getContactById);

router.post("/", isEmptyBody, validateBody(contactAddSchema), controllers.addContact);

router.delete("/:contactId",isValidId,  controllers.removeContact);

router.put("/:contactId",isValidId, isEmptyBody, validateBody(contactUpdateSchema),controllers.updateContact);

router.patch("/:contactId/favorite",isValidId, validateBody(contactFavoriteSchema),isEmptyBody,controllers.updateStatusContact)













export default router;
