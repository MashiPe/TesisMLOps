import sys
def main():
    f = open("/root/scripts/demofile2.txt", "a")
    f.write("Now the file has more content!")
    f.close()
if __name__ == '__main__':
    params=sys.argv
    main()