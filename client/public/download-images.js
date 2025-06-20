const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    {
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
        name: 'hero-bg.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
        name: 'sell-hero.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
        name: 'luxury-villa.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        name: 'penthouse.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c153aee9',
        name: 'property1.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        name: 'property2.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        name: 'rental1.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        name: 'rental2.jpg'
    }
];

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const targetPath = path.join(__dirname, 'public', 'images', filename);
        
        https.get(`${url}?w=1200&q=80`, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(targetPath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Downloaded ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

async function downloadAllImages() {
    try {
        // Create directories if they don't exist
        const dirs = ['public/images', 'public/icons'];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        for (const image of images) {
            await downloadImage(image.url, image.name);
        }
        console.log('All images downloaded successfully!');
    } catch (error) {
        console.error('Error downloading images:', error);
    }
}

downloadAllImages(); 