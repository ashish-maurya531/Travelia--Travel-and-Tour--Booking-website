import express from 'express'
import { createBooking, getAllBooking, getBooking ,deleteBooking} from '../Controllers/bookingController.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.post('/', verifyUser, createBooking)
router.get('/:id', verifyUser,getBooking)
router.get('/', verifyAdmin, getAllBooking)
router.delete('/delete/:id',verifyUser,deleteBooking)


export default router