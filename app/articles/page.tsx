'use client'
import { FunctionComponent } from "react";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from "./page.module.css";
import Link from "next/link";

interface ArticlesPageProps {

}

const ArticlesPage: FunctionComponent<ArticlesPageProps> = () => {
    return (<>
        <div className={styles.container}>
            <div className={styles.title}>
                <h1 style={{ color: "black" }}>Articles Page</h1>
            </div>
            <div className={styles.cards}>
                <Link href="/article1">
                    <div className={styles.card}>
                        <img
                            src="https://imgur.com/1OpAhUn.png"
                            alt="image1"
                            width={300}
                            height={200}
                            style={{ borderRadius: "10px 10px 0px 0px" }} />
                        <div className={styles.cardTitle}>
                            <p>Mengapa Kesehatan Mental Sama Pentingnya dengan Kesehatan Fisik?</p>
                        </div>
                        <div className={styles.cardButton}>
                            <Button size="small">Share</Button>
                            <Button size="small">Learn More</Button>
                        </div>
                    </div>
                </Link>
                <div className={styles.card}>
                    <img
                        src="https://imgur.com/1OpAhUn.png"
                        alt="image1"
                        width={300}
                        height={200}
                        style={{ borderRadius: "10px 10px 0px 0px" }} />
                    <div className={styles.cardTitle}>
                        <p>Mengapa Kesehatan Mental Sama Pentingnya dengan Kesehatan Fisik?</p>
                    </div>
                    <div className={styles.cardButton}>
                        <Button size="small">Share</Button>
                        <Button size="small">Learn More</Button>
                    </div>
                </div>
                <div className={styles.card}>
                    <img
                        src="https://imgur.com/1OpAhUn.png"
                        alt="image1"
                        width={300}
                        height={200}
                        style={{ borderRadius: "10px 10px 0px 0px" }} />
                    <div className={styles.cardTitle}>
                        <p>Mengapa Kesehatan Mental Sama Pentingnya dengan Kesehatan Fisik?</p>
                    </div>
                    <div className={styles.cardButton}>
                        <Button size="small">Share</Button>
                        <Button size="small">Learn More</Button>
                    </div>
                </div><div className={styles.card}>
                    <img
                        src="https://imgur.com/1OpAhUn.png"
                        alt="image1"
                        width={300}
                        height={200}
                        style={{ borderRadius: "10px 10px 0px 0px" }} />
                    <div className={styles.cardTitle}>
                        <p>Mengapa Kesehatan Mental Sama Pentingnya dengan Kesehatan Fisik?</p>
                    </div>
                    <div className={styles.cardButton}>
                        <Button size="small">Share</Button>
                        <Button size="small">Learn More</Button>
                    </div>
                </div>


                {/* <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Lizards are a widespread group of squamate reptiles, with over 6,000
                            species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Share</Button>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Lizards are a widespread group of squamate reptiles, with over 6,000
                            species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Share</Button>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Lizards are a widespread group of squamate reptiles, with over 6,000
                            species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Share</Button>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Lizards are a widespread group of squamate reptiles, with over 6,000
                            species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Share</Button>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card> */}
            </div>
        </div>
    </>);
}

export default ArticlesPage;