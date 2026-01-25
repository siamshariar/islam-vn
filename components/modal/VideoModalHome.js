import { useEffect } from 'react';
import styles from './Video.module.css';
import shareStyles from '../share.module.scss';
import { server } from '../../lib/config';
import Share from '../share';
import Meta from '../meta';
import { generateVParam } from '../../lib/utils';

export default function VideoModal({ isOpen, onClose, videoId, title, description, playlistId }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const videoUrl = `/videos/${videoId}`;

    return (
        <>
            <Meta
                title={title || 'Video Modal'}
                description={description || 'Watch this amazing video.'}
                url={videoUrl}
                type="article"
            />
            <section className={styles.modalWrapper}>
                <div className={styles.overlay}>
                    <div
                        className={styles.content}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span 
                            className={shareStyles.videoClose} 
                            onClick={(e) => {
                                e.stopPropagation()
                                onClose()
                            }}
                        ></span>
                        <div className={styles.iframeContainer}>
                            <iframe
                                className={styles.iframe}
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
                                title={title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className={styles.details}>
                            <h2 className={styles.title}>{title}</h2>
                            <div className={styles.share}>
                                <Share
                                    urlWeb={videoUrl}
                                    urlMobile={videoUrl}
                                    title={title}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
