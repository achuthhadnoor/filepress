import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ScrollArea } from '../components/ui/scroll-area';
import { Card, CardContent } from '../components/ui/card';
import { Save } from 'lucide-react';

export const CompressionSidebar = ({ onCompress }: any) => {
    const [videoSettings, setVideoSettings] = useState({
        codec: 'libx264',
        crf: 23,
        preset: 'medium',
        resolution: 'original',
        audioBitrate: '128',
        frameRate: 'original',
        twoPass: false,
        replaceOriginal: false,
    });

    const [imageSettings, setImageSettings] = useState({
        format: 'jpg',
        quality: 85,
        resize: 'original',
        compressionLevel: 6,
        replaceOriginal: false,
    });

    const updateVideoSetting = (key: string, value: any) => {
        setVideoSettings(prev => ({ ...prev, [key]: value }));
    };

    const updateImageSetting = (key: string, value: any) => {
        setImageSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="w-80 border-l border-neutral-300 h-full flex flex-col">
            <Tabs defaultValue="video" className="flex-1 justify-center items-center w-full px-2 ">
                <TabsList className="grid grid-cols-4 mx-4 mt-2 w-full">
                    <TabsTrigger value="video" >Video</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                    <TabsTrigger value="gif">GIF</TabsTrigger>
                    <TabsTrigger value="pdf">PDF</TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1 w-full">
                    <TabsContent value="video" className="p-1">
                        <Card className='border-none bg-neutral-150'>
                            <CardContent className="space-y-4">
                                {/* <div className=" flex justify-between items-center gap-2">
                                    <Label htmlFor="videoCodec">Codec</Label>
                                    <Select
                                        value={videoSettings.codec}
                                        onValueChange={(value) => updateVideoSetting('codec', value)}
                                    >
                                        <SelectTrigger id="videoCodec">
                                            <SelectValue placeholder="Select codec" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="libx264">H.264 (libx264)</SelectItem>
                                            <SelectItem value="libx265">H.265/HEVC (libx265)</SelectItem>
                                            <SelectItem value="libvpx-vp9">VP9</SelectItem>
                                            <SelectItem value="libaom-av1">AV1</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div> */}

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor="crf">Quality (CRF)</Label>
                                        <span className="text-sm text-neutral-500">{videoSettings.crf}</span>
                                    </div>
                                    <Slider
                                        id="crf"
                                        min={0}
                                        max={51}
                                        step={1}
                                        value={[videoSettings.crf]}
                                        onValueChange={(values) => updateVideoSetting('crf', values[0])}
                                    />
                                    <div className="flex justify-between text-xs text-neutral-500">
                                        <span>Higher Quality</span>
                                        <span>Smaller Size</span>
                                    </div>
                                </div>

                                <div className=" flex justify-between items-center gap-2">
                                    <Label htmlFor="preset">Preset</Label>
                                    <Select
                                        value={videoSettings.preset}
                                        onValueChange={(value) => updateVideoSetting('preset', value)}
                                    >
                                        <SelectTrigger id="preset">
                                            <SelectValue placeholder="Select preset" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ultrafast">Ultrafast</SelectItem>
                                            <SelectItem value="superfast">Superfast</SelectItem>
                                            <SelectItem value="veryfast">Veryfast</SelectItem>
                                            <SelectItem value="faster">Faster</SelectItem>
                                            <SelectItem value="fast">Fast</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="slow">Slow</SelectItem>
                                            <SelectItem value="slower">Slower</SelectItem>
                                            <SelectItem value="veryslow">Veryslow</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className=" flex justify-between items-center gap-2">
                                    <Label htmlFor="resolution">Resolution</Label>
                                    <div className="flex flex-col">
                                        <Select
                                            value={videoSettings.resolution}
                                            onValueChange={(value) => updateVideoSetting('resolution', value)}
                                        >
                                            <SelectTrigger id="resolution">
                                                <SelectValue placeholder="Select resolution" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="original">Original</SelectItem>
                                                <SelectItem value="3840x2160">4K (3840x2160)</SelectItem>
                                                <SelectItem value="1920x1080">1080p (1920x1080)</SelectItem>
                                                <SelectItem value="1280x720">720p (1280x720)</SelectItem>
                                                <SelectItem value="854x480">480p (854x480)</SelectItem>
                                                <SelectItem value="custom">Custom...</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {videoSettings.resolution === 'custom' && (
                                    <div className="flex gap-2 mt-2">
                                        <Input
                                            type="number"
                                            placeholder="Width"
                                            className="w-1/2"
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Height"
                                            className="w-1/2"
                                        />
                                    </div>
                                )}

                                <div className=" flex justify-between items-center gap-2">
                                    <Label htmlFor="audioBitrate">Audio Bitrate (kbps)</Label>
                                    <Select
                                        value={videoSettings.audioBitrate}
                                        onValueChange={(value) => updateVideoSetting('audioBitrate', value)}
                                    >
                                        <SelectTrigger id="audioBitrate">
                                            <SelectValue placeholder="Select bitrate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="64">64 kbps</SelectItem>
                                            <SelectItem value="96">96 kbps</SelectItem>
                                            <SelectItem value="128">128 kbps</SelectItem>
                                            <SelectItem value="192">192 kbps</SelectItem>
                                            <SelectItem value="256">256 kbps</SelectItem>
                                            <SelectItem value="320">320 kbps</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className=" flex justify-between items-center gap-2">
                                    <Label htmlFor="frameRate">Frame Rate</Label>
                                    <Select
                                        value={videoSettings.frameRate}
                                        onValueChange={(value) => updateVideoSetting('frameRate', value)}
                                    >
                                        <SelectTrigger id="frameRate">
                                            <SelectValue placeholder="Select frame rate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="original">Original</SelectItem>
                                            <SelectItem value="60">60 fps</SelectItem>
                                            <SelectItem value="30">30 fps</SelectItem>
                                            <SelectItem value="24">24 fps</SelectItem>
                                            <SelectItem value="15">15 fps</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="twoPass">Two-Pass Encoding</Label>
                                    <Switch
                                        id="twoPass"
                                        checked={videoSettings.twoPass}
                                        onCheckedChange={(checked) => updateVideoSetting('twoPass', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="replaceOriginal">Replace original file(s)</Label>
                                    <Switch
                                        id="replaceOriginal"
                                        checked={videoSettings.replaceOriginal}
                                        onCheckedChange={(checked) => updateVideoSetting('replaceOriginal', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="image" className="p-1">
                        <Card className='border-none bg-neutral-150 p-2'>
                            <CardContent className="">
                                <div className=" flex justify-between items-center gap-2">
                                    <Label htmlFor="format">Format</Label>
                                    <Select
                                        value={imageSettings.format}
                                        onValueChange={(value) => updateImageSetting('format', value)}
                                    >
                                        <SelectTrigger id="format">
                                            <SelectValue placeholder="Select format" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="jpg">JPEG</SelectItem>
                                            <SelectItem value="png">PNG</SelectItem>
                                            <SelectItem value="webp">WebP</SelectItem>
                                            <SelectItem value="avif">AVIF</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex  justify-between items-center">
                                        <Label htmlFor="quality">Quality</Label>
                                        <span className="text-sm text-neutral-500">{imageSettings.quality}%</span>
                                    </div>
                                    <Slider
                                        id="quality"
                                        min={1}
                                        max={100}
                                        step={1}
                                        value={[imageSettings.quality]}
                                        onValueChange={(values) => updateImageSetting('quality', values[0])}
                                    />
                                </div>

                                {imageSettings.format === 'png' && (
                                    <div className=" flex justify-between items-center gap-2">
                                        <div className="flex justify-between">
                                            <Label htmlFor="compressionLevel">Compression Level</Label>
                                            <span className="text-sm text-neutral-500">{imageSettings.compressionLevel}</span>
                                        </div>
                                        <Slider
                                            id="compressionLevel"
                                            min={0}
                                            max={9}
                                            step={1}
                                            value={[imageSettings.compressionLevel]}
                                            onValueChange={(values) => updateImageSetting('compressionLevel', values[0])}
                                        />
                                    </div>
                                )}

                                <div className=" flex justify-between items-center gap-2">
                                    <Label htmlFor="resize">Resize</Label>
                                    <Select
                                        value={imageSettings.resize}
                                        onValueChange={(value) => updateImageSetting('resize', value)}
                                    >
                                        <SelectTrigger id="resize">
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="original">Original Size</SelectItem>
                                            <SelectItem value="3840x2160">4K (3840x2160)</SelectItem>
                                            <SelectItem value="1920x1080">Full HD (1920x1080)</SelectItem>
                                            <SelectItem value="1280x720">HD (1280x720)</SelectItem>
                                            <SelectItem value="800x600">800x600</SelectItem>
                                            <SelectItem value="custom">Custom...</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {imageSettings.resize === 'custom' && (
                                        <div className="flex gap-2 mt-2">
                                            <Input
                                                type="number"
                                                placeholder="Width"
                                                className="w-1/2"
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Height"
                                                className="w-1/2"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="a">Replace original file(s)</Label>
                                    <Switch
                                        id="a"
                                        checked={imageSettings.replaceOriginal}
                                        onCheckedChange={(checked) => {
                                            updateImageSetting('replaceOriginal', checked)
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="gif" className="p-1">
                        <div className="p-2 text-center">coming soon</div>
                    </TabsContent>
                    <TabsContent value="pdf" className="p-1">
                        <div className="p-2 text-center">coming soon</div>
                    </TabsContent>
                </ScrollArea>
            </Tabs>

            <div className="p-4 border-t border-neutral-200">
                <Button className="w-full" onClick={() => onCompress(
                    // { videoSettings, imageSettings }
                )}>
                    <Save className="mr-2 h-4 w-4" />
                    Compress
                </Button>
            </div>
        </div>
    );
};

export default CompressionSidebar;