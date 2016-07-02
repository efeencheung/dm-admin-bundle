<?php

namespace Dm\Bundle\AdminBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * File
 *
 * @ORM\Table()
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 */
class File implements UploadAbleInterface
{
    /**
     * ID
     *
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * 文件名
     *
     * @var string
     *
     * @ORM\Column(name="filename", type="string", length=255, nullable=true)
     */
    private $filename;

	private $file;

	private $tempFilename;

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set filename
     *
     * @param string $filename
     * @return Image
     */
    public function setFilename($filename)
    {
        $this->filename = $filename;

        return $this;
    }

    /**
     * Get filename
     *
     * @return string 
     */
    public function getFilename()
    {
        return $this->filename;
    }

    /**
     * Get file.
     *
     * @return UploadedFile
     */
    public function getFile()
    {
        return $this->file;
    }

    /**
     * {@inheritDoc}
     */
    public function setFile(UploadedFile $file = null)
    {
        $this->file = $file;

        /**
         * 由表单内File内容改变，触发filename这个映射关系的值改变，只有entity的某个值改变，才能触发LifecycleEvent
         */
        if (isset($this->filename)) {
            $this->tempFilename = $this->filename;
        }

        $this->filename = null;
    }

    /**
     * {@inheritDoc}
     */
    public function getTypeName()
    {
        return 'file';
    }

    /**
     * {@inheritDoc}
     */
    public function getWebPath()
    {
        return '/upload/file/' . substr($this->filename, 0, 2) . '/' . $this->filename;
    }

    /**
     * {@inheritDoc}
     */
    public function getTempFilename()
    {
        return $this->tempFilename;
    }
}
