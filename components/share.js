import { server } from '../lib/config'
import { useState } from 'react'
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';

import ShareIcon from '@mui/icons-material/Share'
import CloseIcon from '@mui/icons-material/Close'

import {
	EmailShareButton,
	EmailIcon,
	FacebookShareButton,
	FacebookIcon,
	FacebookMessengerShareButton,
	FacebookMessengerIcon,
	TwitterShareButton,
	TwitterIcon,
	LinkedinShareButton,
	LinkedinIcon,
	WhatsappShareButton,
	WhatsappIcon,
	LineShareButton,
	LineIcon,
	TelegramShareButton,
	TelegramIcon,
	ViberShareButton,
	ViberIcon,
	RedditShareButton,
	RedditIcon,
	TumblrShareButton,
	TumblrIcon
} from 'react-share'

import styles from './share.module.scss'

export default function Share({ urlWeb, urlMobile, title }) {
	const [shareOpen, setShareOpen] = useState(false)
	const [shareUrl, setShareUrl] = useState('')
	const [shareTitle, setShareTitle] = useState('')

	const handleShareClose = (open) => event => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return
		}
		setShareOpen(open)
	}

	const handleWebShare = () => {
		setShareUrl(`${server}/${urlWeb}`)
		setShareTitle(title)
		setShareOpen(true)
	}

	const handleMobileShare = () => {
		if (navigator.share) {
			navigator.share({
				title: title,
				url: urlMobile
			})
		}
		else {
			setShareUrl(`${server}/${urlWeb}`)
			setShareTitle(title)
			setShareOpen(true)
		}
	}

	return (
		<>
			<div className={styles.wrapper}>
				<button
					onClick={() => handleMobileShare()}
					className={`${styles.btn} ${styles.btn_mobile}`}
				>
					Share <ShareIcon />
				</button>

				<button
					onClick={() => handleWebShare()}
					className={`${styles.btn} ${styles.btn_web}`}
				>
					Share <ShareIcon />
				</button>
			</div>

			<ShareModal
				open={shareOpen}
				closer={handleShareClose}
				url={shareUrl}
				title={shareTitle}
			/>
		</>
	)
}

function ShareModal({ open, closer, url, title }) {
	return (
		<Modal
			open={open}
			onClose={closer(false)}
			className={styles.root}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 100,
				classes: {
					root: styles.backdrop
				}
			}}
		>
			<Fade in={open} timeout={100} style={{ transitionDelay: '0ms' }}>
				<div className={styles.modal}>

					<span
						className={styles.close}
						onClick={closer(false)}
					>
						<CloseIcon />
					</span>

					<div className={styles.title}>Share the post</div>

					<div className={styles.lists}>
						<div className={styles.item}>
							<EmailShareButton
                url={url}
                subject={title}
                onShareWindowClose={closer(false)}
              >
								<EmailIcon size={32} round={true} />
							</EmailShareButton>
						</div>

						<div className={styles.item}>
							<FacebookShareButton
                url={url}
                onShareWindowClose={closer(false)}
              >
								<FacebookIcon size={32} round={true} />
							</FacebookShareButton>
						</div>

						{/* <div className={styles.item}>
							<FacebookMessengerShareButton url={url}>
								<FacebookMessengerIcon size={32} round={true} />
							</FacebookMessengerShareButton>
						</div> */}

						<div className={styles.item}>
							<TwitterShareButton
                url={url}
                title={title}
                onShareWindowClose={closer(false)}
              >
								<TwitterIcon size={32} round={true} />
							</TwitterShareButton>
						</div>

						<div className={styles.item}>
							<LinkedinShareButton
                url={url}
                title={title}
                onShareWindowClose={closer(false)}
              >
								<LinkedinIcon size={32} round={true} />
							</LinkedinShareButton>
						</div>

						<div className={styles.item}>
							<WhatsappShareButton
                url={url}
                title={title}
                onShareWindowClose={closer(false)}
              >
								<WhatsappIcon size={32} round={true} />
							</WhatsappShareButton>
						</div>

						<div className={styles.item}>
							<LineShareButton
                url={url}
                title={title}
                onShareWindowClose={closer(false)}
              >
								<LineIcon size={32} round={true} />
							</LineShareButton>
						</div>

						<div className={styles.item}>
							<TelegramShareButton
                url={url}
                title={title}
                onShareWindowClose={closer(false)}
              >
								<TelegramIcon size={32} round={true} />
							</TelegramShareButton>
						</div>

						<div className={styles.item}>
							<ViberShareButton
                url={url}
                title={title}
                onShareWindowClose={closer(false)}
              >
								<ViberIcon size={32} round={true} />
							</ViberShareButton>
						</div>

						<div className={styles.item}>
							<RedditShareButton
                url={url}
                title={title}
                onShareWindowClose={closer(false)}
              >
								<RedditIcon size={32} round={true} />
							</RedditShareButton>
						</div>

						<div className={styles.item}>
							<TumblrShareButton
                url={url}
                title={title}
                onShareWindowClose={closer(false)}
              >
								<TumblrIcon size={32} round={true} />
							</TumblrShareButton>
						</div>
					</div>
				</div>
			</Fade>
		</Modal>
	)
}