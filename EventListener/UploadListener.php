<?php

namespace Dm\Bundle\AdminBundle\EventListener;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Filesystem\Filesystem;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Dm\Bundle\AdminBundle\Entity\UploadAbleInterface;

class UploadListener
{
    private $webRootDir;

    private $fs;

    public function __construct($webRootDir, FileSystem $fs)
    {
        $this->webRootDir = $webRootDir;
        $this->fs = $fs;
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();

        if (!$entity instanceof UploadAbleInterface) {
            return;
        }

        $this->uploadFile($entity);
    }

    public function preUpdate(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();

        if (!$entity instanceof UploadAbleInterface) {
            return;
        }

        $this->uploadFile($entity);
        $this->removeFile($entity);
    }

    public function preRemove(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();

        if (!$entity instanceof UploadAbleInterface) {
            return;
        }

        $this->removeFile($entity);
    }

    protected function uploadFile($entity)
    {
        $file = $entity->getFile();

        if (!$file instanceof UploadedFile) {
            return;
        }

        $filename = sha1(uniqid(mt_rand(), true)) . '.' . $file->guessExtension(); // 生成一个唯一文件名称
        $webPath = '/upload/' . $entity->getTypeName() . '/' . substr($filename, 0, 2); // Web路径
        $filePath = realpath($this->webRootDir) . $webPath; // 文件系统路径

        if (!$this->fs->exists($filePath)) {
           $this->fs->mkdir($filePath);
        }

        $file->move($filePath, $filename);

        $entity->setFilename($filename);
    }

    protected function removeFile($entity)
    {
        $filename = $entity->getTempFilename() ? $entity->getTempFilename() : $entity->getFilename();

        $webPath = '/upload/' . $entity->getTypeName() . '/' . substr($filename, 0, 2); // Web路径
        $filePath = realpath($this->webRootDir) . $webPath; // 文件系统路径

        if (!$this->fs->exists($filePath)) {
           return;
        }

        $this->fs->remove($filePath);
    }
}
