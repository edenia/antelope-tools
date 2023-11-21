import os
import argparse

NETWORKS = [
    'telos',
    'telos-testnet',
    'libre',
    'libre-testnet',
    'xpr',
    'xpr-testnet',
    'wax',
    'wax-testnet',
    'eos',
    'jungle',
    'lacchain',
    'ultra-testnet',
]
DEFAULT_LANGUAGE = 'en'
LANGUAGES = ['en', 'es', 'ko', 'zh']

parser = argparse.ArgumentParser(prog='Simple Sitemap Updater',description='Update the sitemaps alternate links and generate language versions using the sitemap-en.xml as source.')
parser.add_argument('--path', type=str, default='./',
                    help='path where the sitemaps are searched')
parser.add_argument('--networks', nargs="*",
                    type=str,default=[],metavar='Network name',
                    help='the list of networks to update')

args = parser.parse_args()

# Language Handling

def remove_language(url):
    index = url.find('/', 8)
    if index < 0: return url
    language = url[index:index+4]
    return url if language[-1] != '/' or language[0] != '/' else url[:index] + url[index+3:]

def add_language(url, language):
    new_url = remove_language(url)
    if language == DEFAULT_LANGUAGE:
        return new_url
    index = new_url.find('/', 8)
    if index < 0:
        return new_url + '/' + language
    return new_url[:index] + '/' + language + new_url[index:]

# HTML Handling

def generate_alternate_link(url, language):
    link = '      <xhtml:link\n'
    link += '         rel="alternate"\n'
    link += '         hreflang="'+language+'"\n'
    link += '         href="'+add_language(url, language)+'"/>'
    return link

def remove_tags(element):
    string = ''
    include = True
    for char in element:
        if char in ['<', ' ', '\t', '\n']:
            include = False
        if char == '>':
            include = True
            continue
        if include:
            string += char
    return string

# Directory Handling

def write_file(path, content):
    file = open(path, "wt")
    file.write(content)
    file.close()

def create_sub_folders(path, sub_folders):
    for sub_folder in sub_folders:
        if not os.path.exists(path+sub_folder):
            os.makedirs(path+sub_folder)

def get_sitemap_filename(path, language):
    return path+'sitemap-'+language+'.xml'

def add_trailing_slash(path):
    return path + '/' if path[-1] != '/' else path

def get_success_message(file, existed):
    return file + (' updated ' if existed else ' created ') + 'successfully'

# main

path = add_trailing_slash(args.path)

if len(args.networks) > 0:
    networks = [network for network in NETWORKS if network in args.networks]
else:
    networks = NETWORKS

create_sub_folders(path, NETWORKS)

for network in networks:

    network_path = path + network + '/'
    default_sitemap = get_sitemap_filename(network_path, DEFAULT_LANGUAGE)
    
    if not os.path.exists(default_sitemap):
        print('The '+default_sitemap+' file is missing')
        continue

    for language in LANGUAGES:
        new_file = ''
        include = True
        new_path = get_sitemap_filename(network_path, language)
        try:
            with open(default_sitemap, "rt") as file:
                for item in file:
                    if '<xhtml' in item:
                        include = False
                    if not include:
                        if '/>' in item:
                            include = True
                        continue
                    if '<loc>' in item:
                        url = remove_tags(item)
                        new_file += '      <loc>' + \
                            add_language(url, language)+'</loc>\n'
                        for lang in LANGUAGES:
                            if lang == language:
                                continue
                            new_file += generate_alternate_link(url, lang) + '\n'
                    else:
                        new_file += item
            file.close()
            existed = os.path.isfile(new_path)
            write_file(new_path, new_file)
            print(get_success_message(new_path, existed))
        except Exception as error:
            print('An error occurred during '+new_path+' processing:\n'+error)
